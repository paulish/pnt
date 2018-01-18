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
            msg.push(`${s.rank}. ${s.name}`);
    }
    return Promise.resolve('```Markdown\n' + msg.join('\n') + '```');
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

const updatePlayer = (updater, name, message, silent = false) => {
    return getUpdater().updatePlayer(name)
        .then(_ => {
            return silent ? Promise.resolve(true) : message.channel.send(`Информация об игроке ${name} успешно обновлена`);
        })
        .catch(err => message.channel.send(`Ошибка обновления информации об игроке ${name}: ${err.message}`));
}

module.exports = {
    addCommands: (commands) => {
        commands.builtIn.push({
            name: 'я',            
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
            name: 'добавь',            
            help: 'добавить игрока',
            arguments: [{
                name: 'nickname',
                required: true
            }],
            handler: (action, data) => {
                // ищем по нику
                return db.getPlayer(action.nickname)
                    .then(player => {
                        // если не найден ник, то создаем новый
                        if (!player) {
                            return db.addPlayer(action.nickname, null, null)
                                .then(player => {
                                    action.message.channel.send(`Игрок с ником ${player.name} добавлен в базу`);
                                    return updatePlayer(getUpdater(), player.name, action.message);
                                });
                        } else
                            return action.message.reply(`Игрок с ником ${player.name} уже существует`);
                    });
            }
        });

        commands.builtIn.push({
            name: 'тег',
            help: 'установить тег игрока',            
            arguments: [{
                name: 'tag',
                required: true
            }, {
                name: 'nickname',
                required: false
            }],
            handler: (action) => {
                if (action.nickname) {
                    db.getPlayer(action.nickname)
                        .then(player => {
                            if (player) {
                                return db.setTag(player.id, action.tag).then(_ => action.message.channel.send(`Игрок ${player.name} теперь имеет тег ${action.tag}`));
                            } else {
                                return action.message.channel.send(`Игрок ${action.nickname} не найден!`);
                            }
                        });
                } else {
                    db.getDiscordPlayer(action.message.author.id)
                        .then(player => {
                            if (!player) {
                                return action.message.reply('Профиль не привязан. Сначала зарегистрируй свой танковый ник командой !nick');
                            }
                            return db.setTag(player.id, action.tag).then(_ => action.message.channel.send(`Игрок ${player.name} теперь имеет тег ${action.tag}`));
                        });
                }
            }
        });

        commands.builtIn.push({
            name: 'профиль',            
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
            name: 'обнови',            
            help: 'обновить информацию об игроке',
            arguments: [{
                name: 'type',
                required: false,
                values: ['всех', 'старых']
            }],
            handler: (action) => {
                if (action.type) {
                    db.getPlayers(action.type === 'старых')
                        .then(players => {
                            if (players.length > 0) {
                                let updater = getUpdater();
                                let pr = Promise.resolve();
                                for (let player of players) {
                                    pr = pr.then(_ => updatePlayer(updater, player.name, action.message, true));
                                }
                                return pr.then(_ => action.message.channel.send('Обновление игроков завершено!'));
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
            name: 'хочу',            
            help: 'советы по покупке',
            arguments: [{
                name: 'type',
                required: true,
                values: ['модуль', 'пушку', 'корпус', 'подарок']
            }],
            handler: (action) => {
                if (action.type === 'подарок') {
                    return action.message.reply('купи гаечный ключ :wrench:');
                }
                db.getDiscordPlayer(action.message.author.id)
                    .then(player => {
                        if (!player) {
                            return action.message.reply('Профиль не привязан. Сначала зарегистрируй свой танковый ник командой !nick');
                        }
                        let type;
                        switch (action.type) {
                            case 'модуль': type = 'module'; break;
                            case 'пушку': type = 'turret'; break;
                            case 'корпус': type = 'hull'; break;
                        }
                        return db.getSuggests(player.id, type)
                            .then(suggests => {
                                let msg = (type === 'module') ? getImageSuggests(suggests) : getTextSuggests(suggests);
                                msg.then(res => {
                                    if (res) {
                                        if (type === 'module') {
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
            name: 'покажи',
            help: 'сводная таблица',
            arguments: [{
                name: 'type',
                required: true,
                values: ['модули', 'пушки', 'корпуса']
            }],
            handler: (action) => {
                let pr = [db.getPlayers()];
                switch (action.type) {
                    case 'модули': pr.push(db.getModules()); break;
                    case 'пушки': pr.push(db.getTurrets()); break;
                    case 'корпуса': pr.push(db.getHulls()); break;
                }
                Promise.all(pr).then(([players, data]) => {
                    let rows = [];
                    let imgCount = 0;
                    switch (action.type) {
                        case 'модули':
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
                        case 'пушки':
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
                        case 'корпуса':
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
            name: 'рейтинг',
            help: 'рейтинги',
            arguments: [{
                name: 'type',
                required: true,
                values: ['кристаллы', 'опыт', 'голды']
            }],
            handler: (action) => {
                let type;
                switch (action.type) {
                    case 'кристаллы': type = 'crystals'; break;
                    case 'опыт': type = 'score'; break;
                    case 'голды': type = 'golds'; break;
                }
                db.getRating(type).then(data => {
                    let canvas = getImageEngine().getTable([{
                        text: 'Игрок',
                        dataIndex: 'name',
                        width: 200
                    }, {
                        text: action.type,
                        dataIndex: type,
                        width: 180,
                        align: 'right'
                    }, {
                        text: 'прошлая неделя',
                        dataIndex: 'old_' + type,
                        width: 180,
                        align: 'right'
                    }], data);
                    return action.message.channel.send(new Discord.Attachment(canvas.createPNGStream()));
                });
            }
        });

        commands.builtIn.push({
            name: 'кто',
            help: 'кто',
            arguments: [{
                name: 'type',
                required: true,
                values: ['нуб', 'герой', 'читер']
            }],
            handler: (action) => {
                let answer = '';
                switch (action.type) {
                    case 'нуб': answer = 'ты нуб!'; break;
                    case 'герой': answer = 'герой я и мой создатель, а ты нуб!'; break;
                    case 'читер': answer = 'конечно вор_закун!'; break;
                }
                return action.message.reply(answer);
            }
        });
    }
}