const path = require('path');
const sqlite = require('sqlite');

const extractRes = (props) => {
    let res = [];
    for (prop of props) {
        res.push(prop.toLowerCase().replace('_resistance', ''));
    }
    return res;
}

class db {
    constructor() {
        this.intialized = false;
    }

    init(fileName) {
        if (this.intialized) return Promise.resolve(true);

        return sqlite.open(fileName)
            .then(_ => sqlite.run('PRAGMA foreign_keys = ON'))
            .then(_ => sqlite.migrate());
    }

    finalize() {
        return sqlite.close();
    }

    getPlayers() {
        return sqlite.all('SELECT * FROM PLAYER ORDER BY idx is null, idx, tag is null, tag');
    }

    getModules() {
        return sqlite.all(
            `select m.*, p.name player, pm.time_played, pm.mu from 
        module m
          join player_modules pm on (pm.idmodule = m.id)
          join player p on (pm.idplayer = p.id)
    ORDER BY
        M.RANK, M.IDX IS NULL, M.IDX, M.name`)
            .then(data => {
                let res = [], last = { id: 0 };
                for (let i of data) {
                    if (i.id !== last.id) {
                        last = {
                            id: i.id,
                            name: i.name,
                            rank: i.rank,
                            res: [i.res1, i.res2, i.res3],
                            players: [],
                            times: []
                        };
                        res.push(last);
                    }
                    last.players.push(i.player);
                    last.times.push(i.time_played);
                }
                return Promise.resolve(res);
            });
    }

    getHulls() {
        return sqlite.all(
            `select m.*, p.name player, pm.time_played, pm.mu from 
        hull m
          join player_hulls pm on (pm.idhull = m.id)
          join player p on (pm.idplayer = p.id)
    ORDER BY
        M.RANK, M.IDX IS NULL, M.IDX, M.name`)
            .then(data => {
                let res = [], last = { id: 0 };
                for (let i of data) {
                    if (i.id !== last.id) {
                        last = {
                            id: i.id,
                            name: i.name,
                            rank: i.rank,
                            players: [],
                            times: []
                        };
                        res.push(last);
                    }
                    last.players.push(i.player);
                    last.times.push(i.time_played);
                }
                return Promise.resolve(res);
            });
    }

    getTurrets() {
        return sqlite.all(
            `select m.*, p.name player, pm.time_played, pm.mu from 
        turret m
          join player_turrets pm on (pm.idturret = m.id)
          join player p on (pm.idplayer = p.id)
    ORDER BY
        M.RANK, M.IDX IS NULL, M.IDX, M.name`)
            .then(data => {
                let res = [], last = { id: 0 };
                for (let i of data) {
                    if (i.id !== last.id) {
                        last = {
                            id: i.id,
                            name: i.name,
                            engName: i.eng_name,
                            rank: i.rank,
                            players: [],
                            times: []
                        };
                        res.push(last);
                    }
                    last.players.push(i.player);
                    last.times.push(i.time_played);
                }
                return Promise.resolve(res);
            });
    }

    getPlayer(name) {
        return sqlite.get('SELECT * FROM PLAYER WHERE name = ?', name);
    }

    getModule(name, properties) {
        return sqlite.get('SELECT * FROM MODULE WHERE name = ?', name)
            .then(data => {
                if (data) return Promise.resolve(data);
                let props = extractRes(properties);
                return sqlite.run('INSERT INTO MODULE (name, rank, res1, res2, res3) VALUES (?, 4, ?, ?, ?)', name, props[0], props[1], props[2])
                    .then(ins => {
                        return Promise.resolve({
                            id: ins.stmt.lastID,
                            name: name,
                            rank: 4,
                            res1: props[0],
                            res2: props[1],
                            res3: props[2]
                        });
                    });
            });
    }

    getHull(name) {
        return sqlite.get('SELECT * FROM HULL WHERE name = ?', name)
            .then(data => {
                if (data) return Promise.resolve(data);
                return sqlite.run('INSERT INTO HULL (name, rank) VALUES (?, 4)', name)
                    .then(ins => {
                        return Promise.resolve({
                            id: ins.stmt.lastID,
                            name: name,
                            rank: 4
                        });
                    });
            });
    }

    getTurret(name) {
        return sqlite.get('SELECT * FROM TURRET WHERE name = ?', name)
            .then(data => {
                if (data) return Promise.resolve(data);
                return sqlite.run('INSERT INTO TURRET (name, rank) VALUES (?, 4)', name)
                    .then(ins => {
                        return Promise.resolve({
                            id: ins.stmt.lastID,
                            name: name,
                            rank: 4
                        });
                    });
            });
    }

    updateModules(idplayer, data) {
        let pr = Promise.resolve();
        for (let i of data) {
            if (i.grade === 3 && i.properties.length === 3) {
                pr = pr.then(_ => {
                    return this.getModule(i.name, i.properties)
                        .then(item => {
                            //console.log('updating module:', i.name);
                            return sqlite.run('INSERT OR REPLACE INTO player_modules (idplayer, idmodule, time_played) VALUES (?, ?, ?)', idplayer, item.id, i.timePlayed)
                        });
                });
            }
        }
        return pr;
    }

    updateHulls(idplayer, data) {
        let pr = Promise.resolve();
        for (let i of data) {
            if (i.grade === 3) {
                pr = pr.then(_ => {
                    return this.getHull(i.name)
                        .then(item => {
                            //console.log('updating hull:', i.name);
                            return sqlite.run('INSERT OR REPLACE INTO player_hulls (idplayer, idhull, time_played) VALUES (?, ?, ?)', idplayer, item.id, i.timePlayed)
                        });
                });
            }
        }
        return pr;
    }

    updateTurrets(idplayer, data) {
        let pr = Promise.resolve();
        for (let i of data) {
            if (i.grade === 3) {
                pr = pr.then(_ => {
                    return this.getTurret(i.name)
                        .then(item => {
                            //console.log('updating turret:', i.name);
                            return sqlite.run('INSERT OR REPLACE INTO player_turrets (idplayer, idturret, time_played) VALUES (?, ?, ?)', idplayer, item.id, i.timePlayed)
                        });
                });
            }
        }
        return pr;
    }

    updatePlayer(name, data) {
        return this.getPlayer(name)
            .then(player => {
                console.log('updating player:', player.name);
                return Promise.all([
                    this.updateModules(player.id, data.resistanceModules),
                    this.updateHulls(player.id, data.hullsPlayed),
                    this.updateTurrets(player.id, data.turretsPlayed)
                ]);
            })
    }

    addPlayer(name, tag) {
        return sqlite.run('insert or replace into player (name, tag) values (?, ?)', name, tag)
            .then(_ => this.getPlayer(name));
    }

    delPlayer(name) {
        return sqlite.run('DELETE FROM player WHERE lower(name) = ?', name.toLowerCase());
    }
}

module.exports = new db();