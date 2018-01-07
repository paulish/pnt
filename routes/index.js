const express = require('express');
const router = express.Router();
const request = require('request-promise');
const db = require('../lib/db');
const Updater = require('../lib/updater');

const getUpdater = () => {
    return new Updater('http://ratings.tankionline.com/get_stat/profile/', db);
}

router.get('/', (req, res) => {

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

router.get('/update', (req, res) => {
    return getUpdater().updatePlayers()
        .then(_ => res.json('ok'));
});

router.get('/addPlayer', (req, res) => {
    return db.addPlayer(req.query.name, req.query.tag)
        .then(player => getUpdater().updatePlayer(player.name))
        .then(_ => res.json('ok'));
});

router.get('/delPlayer', (req, res) => {
    return db.delPlayer(req.query.name)
        .then(_ => res.json('ok'));
});

module.exports = router;