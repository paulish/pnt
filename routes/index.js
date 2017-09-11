const express = require('express');
const router = express.Router();
const request = require('request-promise');
const modules = require('../lib/modules');

const players = [
    'paulish',
    'A_G_R_O_N_O_M',
    'kratasuk85',
    'sherxan',
    'CkuJIJIa_HET',
    'Kira-5let',
    'K_H_9l_3_b-T_b_M_bl',
    'KaBka3ckuu_TIJIeHHuk',
    'KyKoJIkA',
    'C.0.H',
    'D_O_H_6_A_C_C'
];

const extractRes = (props) => {
    let res = [];
    for (prop of props) {
        res.push(prop.toLowerCase().replace('_resistance', ''));
    }
    return res;
}

const handlePlayer = (resp, moduleNames, data) => {
    if (resp && resp.responseType === 'OK') {
        let player = resp.response;
        data.players.push(player.name);
        for (let m of player.resistanceModules) {
            if (m.grade === 3) {
                let idx = moduleNames.indexOf(m.name);
                if (idx !== -1) {
                    data.modules[idx].players.push(player.name);
                } else if (m.properties.length === 3) {
                    idx = moduleNames.length;
                    moduleNames.push(m.name);
                    data.modules.push({
                        name: m.name,
                        rank: 4,
                        res: extractRes(m.properties),
                        players: [player.name]
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
        modules: []
    };

    for (let m in modules) {
        data.modules.push({
            name: m,
            rank: modules[m].rank,
            res: modules[m].res,
            players: []
        });
    }

    let moduleNames = Object.keys(modules);

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
                .then((resp) => handlePlayer(resp, moduleNames, data))
        )
    }
    pr.then(() => res.render('index', data));
});

module.exports = router;