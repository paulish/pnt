const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage, registerFont } = require('canvas');

const useRankColor = {
  0: '#00a2ff',
  1: '#00ff00',
  2: '#ffff00',
  3: '#ff9900',
  4: '#ff0000',
  5: '#980000'
}

const getRank = (hours) => {
  if (hours > 40) return 5;
  if (hours > 20) return 4;
  if (hours > 10) return 3;
  if (hours > 4) return 2;
  if (hours > 1) return 1;
  return 0;
}

const getPlayerInfo = (name, items) => {
  let idx = items.players.indexOf(name);
  if (idx !== -1) {
    return { rank: getRank(items.info[idx].time / 3600000), mu: items.info[idx].mu };
  } else {
    return { rank: null, mu: null };
  }
}


class ImageEngine {
  constructor(imageDir, fontDir) {
    this.imageDir = imageDir;
    this.fontDir = fontDir;
    this.imageCache = {};
    this.captionWidth = 100;
    registerFont(path.join(fontDir, 'Roboto-Regular.ttf'), { family: 'roboto' });
  }

  getImage(name) {
    if (this.imageCache[name])
      return Promise.resolve(this.imageCache[name]);
    return loadImage(path.join(this.imageDir, name))
      .then(image => {
        this.imageCache[name] = image;
        return Promise.resolve(image);
      })
  }

  getResistanceImage(params) {
    let pr = [this.getImage("resistance_icon_background.png")];
    for (let res of params.resistances) {
      pr.push(this.getImage(res + "_resistance.png"));
    }
    return Promise.all(pr)
      .then(images => {
        let w = images[0].width;
        let h = images[0].height;
        let tw = params.name ? this.captionWidth : 0;
        let res = createCanvas(w * (images.length - 1) + tw, h);
        let ctx = res.getContext('2d');
        if (params.fill) {
          ctx.fillStyle = params.fill;
          ctx.fillRect(0, 0, res.width, res.height);
        }
        if (params.name) {
          ctx.font = '14px roboto';
          ctx.beginPath();
          ctx.fillStyle = params.textFill || "#FFFFFF";
          ctx.fillText(params.name, 5, 20, this.captionWidth);
          ctx.stroke();
        }
        for (let i = 1; i < images.length; i++) {
          ctx.drawImage(images[0],
            0, 0, w, h, // source dimensions
            tw + (i - 1) * w, 0, w, h
          );
          let iw = images[i].width;
          let ih = images[i].height;
          ctx.drawImage(images[i],
            0, 0, iw, ih,
            tw + (i - 1) * w + (w - iw - 2) / 2, (h - ih - 2) / 2, iw, ih
          );
        }
        return Promise.resolve(res);
      });
  }

  getResistancesImage(rows) {
    let pr = [];
    for (let row of rows) {
      pr.push(this.getResistanceImage(row));
    }
    return Promise.all(pr)
      .then(images => {
        let w = 0;
        let h = 0;
        for (let image of images) {
          w = Math.max(w, image.width);
          h += image.height;
        }
        let res = createCanvas(w, h);
        let ctx = res.getContext('2d');
        ctx.fillStyle = '#36393E';
        ctx.fillRect(0, 0, w, h);
        h = 0;
        for (let image of images) {
          ctx.drawImage(image,
            0, 0, image.width, image.height,
            0, h, image.width, image.height);
          h += image.height;
        }
        return Promise.resolve(res);
      });
  }

  getModuleCross(players, data, rankColor) {
    // считаем размеры
    return this.getImage("resistance_icon_background.png").then(image => {
      let resWidth = image.width;
      let resHeight = image.height;
      let moduleWidth = resWidth * 3 + this.captionWidth;
      const playerWidth = 40;
      const playerHeight = this.captionWidth * 2;
      let res = createCanvas(moduleWidth + players.length * playerWidth, playerHeight + resHeight * data.length);
      let ctx = res.getContext('2d');
      ctx.font = '14px roboto';
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#ddd';
      ctx.fillRect(0, 0, res.width, res.height);
      let h = playerHeight;

      let rows = [];

      for (let i of data) {
        rows.push({
          name: i.name,
          fill: rankColor[i.rank],
          textFill: '#000000',
          resistances: i.res
        })
      }

      return this.getResistancesImage(rows).then(canvas => {
        ctx.drawImage(canvas, 0, playerHeight);
        let w = moduleWidth;
        for (let i of players) {
          ctx.save();
          ctx.translate(w, playerHeight);
          ctx.rotate(-Math.PI / 2);
          ctx.textAlign = "left";
          ctx.beginPath();
          ctx.fillStyle = "#000000";
          ctx.fillText(i.name, 5, 24, 100);
          ctx.stroke();
          ctx.restore();
          ctx.strokeRect(w, 0, playerWidth, playerHeight);
          w += playerWidth;
        }
        h = playerHeight;
        for (let m of data) {
          w = moduleWidth;
          for (let p of players) {
            let info = getPlayerInfo(p.name, m);
            ctx.fillStyle = (info.rank !== null) ? useRankColor[info.rank] : '#ffffff';            
            ctx.fillRect(w, h, playerWidth, resHeight);
            ctx.strokeRect(w, h, playerWidth, resHeight);
            w += playerWidth;
          }
          h += resHeight;
        }
        return Promise.resolve(res);
      })
    });
  }
}

module.exports = ImageEngine;