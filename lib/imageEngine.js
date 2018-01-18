const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage, registerFont } = require('canvas');

const useRankColor = {
  0: { color: '#00a2ff', text: 'до 1 часа' },
  1: { color: '#00ff00', text: 'больше 1 часа' },
  2: { color: '#ffff00', text: 'больше 4 часов' },
  3: { color: '#ff9900', text: 'больше 10 часов' },
  4: { color: '#ff0000', text: 'больше 20 часов' },
  5: { color: '#980000', text: 'больше 40 часов' }
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
    this.captionWidth = 150;
    registerFont(path.join(fontDir, 'Roboto-Regular.ttf'), { family: 'Roboto' });
    registerFont(path.join(fontDir, 'Roboto-Medium.ttf'), { family: 'Roboto', weight: '500' });
    registerFont(path.join(fontDir, 'Roboto-Bold.ttf'), { family: 'Roboto', weight: 'bold' });
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
    let pr = [];
    if (params.resistances) {
      pr.push(this.getImage("resistance_icon_background.png"));
      for (let res of params.resistances) {
        if (res) pr.push(this.getImage(res + "_resistance.png"));
      }
    }
    return Promise.all(pr)
      .then(images => {
        let w = images.length ? images[0].width : 0;
        let h = images.length ? images[0].height : 34;
        let tw = params.name ? this.captionWidth : 0;
        let res = createCanvas(w * (images.length ? images.length - 1 : 0) + tw, h);
        let ctx = res.getContext('2d');
        if (params.fill) {
          ctx.fillStyle = params.fill;
          ctx.fillRect(0, 0, res.width, res.height);
        }
        if (params.name) {
          ctx.font = '14px Roboto';
          ctx.beginPath();
          ctx.fillStyle = params.textFill || "#FFFFFF";
          ctx.fillText(params.name, 5, 20, tw);
          ctx.stroke();
        }
        if (images.length) {
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

  getLegend(w, h, textStyle) {
    let res = createCanvas(w, h);
    let ctx = res.getContext('2d');
    ctx.strokeStyle = '#ddd';
    ctx.font = '500 14px Roboto';
    let spacing = 5;
    let ih = Math.min(34, Math.floor(h / Object.keys(useRankColor).length)) - spacing * 2;
    let y = spacing;
    for (let r in useRankColor) {
      ctx.fillStyle = useRankColor[r].color;
      ctx.fillRect(spacing, y, ih, ih);
      ctx.strokeRect(spacing, y, ih, ih);

      ctx.fillStyle = textStyle;
      ctx.fillText(useRankColor[r].text, ih + spacing * 2, y + (ih + 14) / 2, w - ih - spacing * 2);

      y += ih + spacing;
    }
    return res;
  }

  getCross(players, data, rows, imgCount) {
    // считаем размеры
    return this.getImage("resistance_icon_background.png").then(image => {
      let resWidth = image.width;
      let resHeight = image.height;
      let headerWidth = resWidth * imgCount + this.captionWidth;
      const playerWidth = 40;
      const playerHeight = this.captionWidth * 2;
      let res = createCanvas(headerWidth + players.length * playerWidth, playerHeight + resHeight * data.length);
      let ctx = res.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#ddd';
      ctx.fillRect(0, 0, res.width, res.height);
      ctx.drawImage(this.getLegend(headerWidth, playerHeight, '#000000'), 0, 0);
      let h = playerHeight;

      return this.getResistancesImage(rows).then(canvas => {
        ctx.drawImage(canvas, 0, playerHeight);
        let w = headerWidth;
        for (let i of players) {
          ctx.save();
          ctx.translate(w, playerHeight);
          ctx.rotate(-Math.PI / 2);
          ctx.font = '500 14px Roboto';
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
          w = headerWidth;
          for (let p of players) {
            let info = getPlayerInfo(p.name, m);
            ctx.fillStyle = (info.rank !== null) ? useRankColor[info.rank].color : '#ffffff';
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

  getTable(header, data) {
    let rh = 30;
    let w = 0;
    let h = (data.length + 1) * rh;
    for (let i in header) {
      w += header[i].width;
    }
    let res = createCanvas(w, h);
    let ctx = res.getContext('2d');
    ctx.fillStyle = '#36393E';
    ctx.strokeStyle = '#ddd';
    ctx.fillRect(0, 0, w, h);

    // draw header    
    ctx.fillStyle = '#ffffff';
    w = 0;
    for (let i in header) {
      h = 0;
      ctx.font = 'bold 14px Roboto';
      ctx.textAlign = "center";
      let hw = header[i].width;
      ctx.fillText(header[i].text, w + hw / 2, h + 17, hw - 10);
      ctx.strokeRect(w, h, w + hw, rh);
      h += rh;
      ctx.font = '500 14px Roboto';
      for (let d of data) {
        let pos = w + 5;
        if (header[i].align === 'right') {
          pos = w + hw - 5;
          ctx.textAlign = 'right';
        } else {
          ctx.textAlign = 'left';
        }        
        ctx.fillText(d[header[i].dataIndex], pos, h + 19, hw - 10);
        ctx.strokeRect(w, h, w + hw, h + rh);
        h += rh;
      }
      w += hw;
    }
    return res;
  }
}

module.exports = ImageEngine;