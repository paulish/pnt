const express = require('express');
const router = express.Router();
const request = require('request-promise');
const db = require('../lib/db');
const Updater = require('../lib/updater');

router.get('/', function (req, res) {

    Promise.all([
        db.getPlayers(),
        db.getModules(),
        db.getTurrets(),
        db.getHulls()
    ])
        .then(([players, modules, turrets, hulls]) => {
            let data = {
                page: 'index',
                players: players,
                modules: modules,
                turrets: turrets,
                hulls: hulls
            };
            return res.render('index', data);
        })
        .catch(err => {
            console.log(err.message);
            return res.error(err);
        });
});

router.get('/update', function (req, res) {
    let updater = new Updater('http://ratings.tankionline.com/get_stat/profile/', db);
    return updater.updatePlayers()
        .then(_ => res.json('ok'));
});

module.exports = router;