const request = require('request-promise');

class updater {
    constructor(uri, db) {
        this.uri = uri;
        this.db = db;
    }

    updatePlayer(name) {
        return request({
            uri: this.uri,
            qs: {
                user: name,
                lang: 'ru'
            },
            json: true
        }).then((resp) => {
            if (resp && resp.responseType === 'OK') return this.db.updatePlayer(name, resp.response);
            return Promise.reject(new Error('Ошибка запроса данных по пользователю: ' + name));
        });
    }

    updatePlayers() {
        return this.db.getPlayers()
            .then(players => {
                let pr = Promise.resolve();
                for (let player of players) {
                    pr = pr.then(_ => this.updatePlayer(player.name));
                }
                return pr;
            });            
    }
}

module.exports = updater;