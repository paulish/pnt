const express = require('express');
const router = express.Router();
const request = require('request-promise');
const db = require('../lib/db');

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

module.exports = router;