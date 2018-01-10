const path = require('path');
const db = require('./db');
const Updater = require('./updater');
const ImageEngine = require('./imageEngine');
const Discord = require('discord.js');

const getUpdater = () => {
    return new Updater('http://ratings.tankionline.com/get_stat/profile/', db);
}

const getImageEngine = () => {
    return new ImageEngine(path.resolve('./public/img/resistance/'), path.resolve('./fonts'));
}

const rankColor = {
    1: '#d9ead3',
    2: '#fff2cc',
    3: '#fce5cd',
    4: '#cfe2f3'
}

const getTextSuggests = (suggests) => {
    let msg = [];
    for (s of suggests) {
        if (!s.name.endsWith(' XT'))
            msg.push(`${s.rank} - ${s.name}`);
    }
    return Promise.resolve(msg.join('\r\n'));
}

const getImageSuggests = (suggests) => {
    let cfg = [];
    for (s of suggests) {
        cfg.push({
            name: `${s.rank} - ${s.name}`,
            fill: rankColor[s.rank],
            textFill: '#000000',
            resistances: [s.res1, s.res2, s.res3]
        });
    }

    return getImageEngine().getResistancesImage(cfg)
        .then(canvas => Promise.resolve(canvas.createPNGStream()));
}

const updatePlayer = (updater, name, message) => {
    return getUpdater().updatePlayer(name)
        .then(_ => {
            return message.channel.send(`Информация об игроке ${name} успешно обновлена`);
        })
        .catch(err => message.channel.send(`Ошибка обновления информации об игроке ${name}: ${err.message}`));
}

module.exports = {
    addCommands: (commands) => {
        commands.builtIn.push({
            name: 'nick',
            help: 'зарегистрировать танковый ник',
            arguments: [{
                name: 'nickname',
                required: true
            }],
            handler: (action, data) => {
                db.getDiscordPlayer(action.message.author.id)
                    .then(player => {
                        if (player) {
                            // если не совпадают имена игроков
                            if (player.name.toLowerCase() !== action.nickname) {
                                return db.setDiscordId(player.id, null);
                            } else {
                                return Promise.resolve(true);
                            }
                        }
                    })
                    .then(_ => {
                        // теперь ищем по нику
                        return db.getPlayer(action.nickname)
                            .then(player => {
                                // если не найден ник, то создаем новый
                                if (!player) {
                                    return db.addPlayer(action.nickname, null, action.message.author.id)
                                        .then(player => {
                                            action.message.channel.send(`Игрок с ником ${player.name} добавлен в базу и привязан к ${action.message.author.username}`);
                                            return updatePlayer(getUpdater(), player.name, action.message);
                                        });
                                }
                                // если id не тот, то меняем привязку
                                if (player.discord_id !== action.message.author.id) {
                                    return db.setDiscordId(player.id, action.message.author.id)
                                        .then(_ => {
                                            action.message.channel.send(`Игрок с ником ${player.name} привязан к ${action.message.author.username}`);
                                            return updatePlayer(getUpdater(), player.name, action.message);
                                        })
                                }
                                return action.message.reply('Всё уже привязано');
                            })
                    });
            }
        });

        commands.builtIn.push({
            name: 'profile',
            help: 'показать ссылку на профиль',
            handler: (action) => {
                db.getDiscordPlayer(action.message.author.id)
                    .then(player => {
                        if (!player) {
                            return action.message.reply('Профиль не привязан. Сначала зарегистрируй свой танковый ник командой !nick');
                        }
                        action.message.channel.send(`http://ratings.tankionline.com/ru/user/${player.name}/`);
                    });
            }
        });

        commands.builtIn.push({
            name: 'update',
            help: 'обновить информацию об игроке',
            arguments: [{
                name: 'type',
                required: false,
                values: ['all', 'old']
            }],
            handler: (action) => {
                if (action.type) {
                    db.getPlayers(action.type === 'old')
                        .then(players => {
                            if (players.length > 0) {
                                let updater = getUpdater();
                                let pr = Promise.resolve();
                                for (let player of players) {
                                    pr = pr.then(_ => updatePlayer(updater, player.name, action.message));
                                }
                                return pr;
                            } else {
                                return action.message.channel.send('Некого обновлять. Все свежие!');
                            }
                        });
                } else {
                    db.getDiscordPlayer(action.message.author.id)
                        .then(player => {
                            if (!player) {
                                return action.message.reply('Профиль не привязан. Сначала зарегистрируй свой танковый ник командой !nick');
                            }
                            return updatePlayer(getUpdater(), player.name, action.message);
                        });
                }
            }
        });

        commands.builtIn.push({
            name: 'buy',
            help: 'советы по покупке',
            arguments: [{
                name: 'type',
                required: true,
                values: ['module', 'turret', 'hull', 'present']
            }],
            handler: (action) => {
                if (action.type === 'present') {
                    return action.message.reply('купи гаечный ключ');
                }
                db.getDiscordPlayer(action.message.author.id)
                    .then(player => {
                        if (!player) {
                            return action.message.reply('Профиль не привязан. Сначала зарегистрируй свой танковый ник командой !nick');
                        }
                        return db.getSuggests(player.id, action.type)
                            .then(suggests => {
                                let msg = (action.type === 'module') ? getImageSuggests(suggests) : getTextSuggests(suggests);
                                msg.then(res => {
                                    if (res) {
                                        if (action.type === 'module') {
                                            action.message.reply('Вот тебе советы по покупке:', new Discord.Attachment(res));
                                        } else
                                            action.message.reply('Вот тебе советы по покупке:\r\n' + res);
                                    } else {
                                        action.message.reply('Тебе ничего не надо покупать! Качайся.');
                                    }
                                })
                            });
                    });
            }
        });

        commands.builtIn.push({
            name: 'cross',
            help: 'сводная таблица',
            arguments: [{
                name: 'type',
                required: true,
                values: ['module', 'turret', 'hull']
            }],
            handler: (action) => {
                let pr = [db.getPlayers()];
                switch (action.type) {
                    case 'module': pr.push(db.getModules()); break;
                    case 'turret': pr.push(db.getTurrets()); break;
                    case 'hull': pr.push(db.getHulls()); break;
                }
                Promise.all(pr).then(([players, data]) => {
                    let rows = [];
                    let imgCount = 0;
                    switch (action.type) {
                        case 'module':
                            for (let i of data) {
                                rows.push({
                                    name: i.name,
                                    fill: rankColor[i.rank],
                                    textFill: '#000000',
                                    resistances: i.res
                                })
                            }
                            imgCount = 3;
                            break;
                        case 'turret':
                            for (let i of data) {
                                rows.push({
                                    name: i.name,
                                    fill: rankColor[i.rank],
                                    textFill: '#000000',
                                    resistances: [i.engName]
                                })
                            }
                            imgCount = 1;
                            break;
                        case 'hull':
                            for (let i of data) {
                                rows.push({
                                    name: i.name,
                                    fill: rankColor[i.rank],
                                    textFill: '#000000'
                                })
                            }
                            imgCount = 0;
                            break;
                    }
                    return getImageEngine().getCross(players, data, rows, imgCount).then(canvas => action.message.channel.send(new Discord.Attachment(canvas.createPNGStream())));
                })
            }
        });

        commands.builtIn.push({
            name: 'rating',
            help: 'рейтинги',
            arguments: [{
                name: 'type',
                required: true,
                values: ['crystals', 'score', 'golds']
            }],
            handler: (action) => {
                db.getRating(action.type).then(data => {
                    let canvas = getImageEngine().getTable([{
                        text: 'Игрок',
                        dataIndex: 'name',
                        width: 200
                    }, {
                        text: 'Значение',
                        dataIndex: action.type,
                        width: 180,
                        align: 'right'
                    }, {
                        text: 'Старое значение',
                        dataIndex: 'old_' + action.type,
                        width: 180,
                        align: 'right'
                    }], data);
                    return action.message.channel.send(new Discord.Attachment(canvas.createPNGStream()));
                });
            }
        });
    }
}