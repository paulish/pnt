const db = require('./db');
const Updater = require('../lib/updater');

const getUpdater = () => {
    return new Updater('http://ratings.tankionline.com/get_stat/profile/', db);
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
                                    return db.addPlayer(action.nickname, null, action.message.author.id).then(player => action.message.reply(`Игрок с ником ${player.name} добавлен в базу и привязан к ${action.message.author.username}`));
                                }
                                // если id не тот, то меняем привязку
                                if (player.discord_id !== action.message.author.id) {
                                    return db.setDiscordId(player.id, action.message.author.id).then(_ => action.message.reply(`Игрок с ником ${player.name} привязан к ${action.message.author.username}`))
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
            handler: (action) => {
                db.getDiscordPlayer(action.message.author.id)
                    .then(player => {
                        if (!player) {
                            return action.message.reply('Профиль не привязан. Сначала зарегистрируй свой танковый ник командой !nick');
                        }
                        return getUpdater().updatePlayer(player.name)
                            .then(_ => {
                                return action.message.reply(`Информация об игроке ${player.name} успешно обновлена`);
                            })
                            .catch(err => action.message.reply(err.message))
                    });
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
                db.getDiscordPlayer(action.message.author.id)
                    .then(player => {
                        if (!player) {
                            return action.message.reply('Профиль не привязан. Сначала зарегистрируй свой танковый ник командой !nick');
                        }
                        return db.getSuggests(player.id, action.type)
                            .then(suggests => {
                                let msg = [];
                                for (s of suggests) {
                                    if (!s.name.endsWith(' XT'))
                                        msg.push(`${s.rank} - ${s.name}`);
                                }
                                if (msg.length > 0) {
                                    action.message.reply('Вот тебе советы по покупке:\r\n' + msg.join('\r\n'));
                                } else {
                                    action.message.reply('Тебе ничего не надо покупать! Качайся.');
                                }
                            });
                    });
            }
        });
    }
}