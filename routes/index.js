const express = require('express');
const router = express.Router();
const request = require('request-promise');
const players = require('../lib/players');
const modules = require('../lib/modules');
const turrets = require('../lib/turrets');

const extractRes = (props) => {
    let res = [];
    for (prop of props) {
        res.push(prop.toLowerCase().replace('_resistance', ''));
    }
    return res;
}

const handlePlayer = (resp, moduleNames, turretNames, data) => {
    if (resp && resp.responseType === 'OK') {
        let player = resp.response;
        data.players.push(player.name);
        for (let m of player.resistanceModules) {
            if (m.grade === 3) {
                let idx = moduleNames.indexOf(m.name);
                if (idx !== -1) {
                    data.modules[idx].players.push(player.name);
                    data.modules[idx].times.push(m.timePlayed);
                } else if (m.properties.length === 3) {
                    idx = moduleNames.length;
                    moduleNames.push(m.name);
                    data.modules.push({
                        name: m.name,
                        rank: 4,
                        res: extractRes(m.properties),
                        players: [player.name],
                        times: [m.timePlayed]
                    })
                }
            }
        }
        for (let t of player.turretsPlayed) {
            if (t.grade === 3) {
                let idx = turretNames.indexOf(t.name);
                if (idx !== -1) {
                    data.turrets[idx].players.push(player.name);
                    data.turrets[idx].times.push(t.timePlayed);
                } else {
                    idx = turretNames.length;
                    turretNames.push(t.name);
                    data.turrets.push({
                        name: t.name,
                        rank: 4,
                        id: '',
                        players: [player.name],
                        times: [t.timePlayed]
                    })
                }
            }
        }
    }
}

router.get('/', function (req, res) {
    let data = {
        page: 'index',
        players: [],
        modules: [],
        turrets: []
    };

    for (let m in modules) {
        data.modules.push({
            name: m,
            rank: modules[m].rank,
            res: modules[m].res,
            players: [],
            times: []
        });
    }

    for (let t in turrets) {
        data.turrets.push({
            name: t,
            id: turrets[t].id,
            rank: turrets[t].rank,            
            players: [],
            times: []
        });
    }

    let moduleNames = Object.keys(modules);
    let turretNames = Object.keys(turrets);

    let pr = Promise.resolve(true);

    for (let player of players) {
        pr = pr.then(() =>
            request({
                uri: 'http://ratings.tankionline.com/get_stat/profile/',
                qs: {
                    user: player,
                    lang: 'ru'
                },
                json: true
            })
                .then((resp) => handlePlayer(resp, moduleNames, turretNames, data))
        )
    }
    pr.then(() => res.render('index', data));
});

module.exports = router;