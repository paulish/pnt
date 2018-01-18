const path = require('path');
const Discord = require('discord.js');
const Commands = require('./lib/commands')
const db = require('./lib/db');
const cmdTanks = require('./lib/cmdTanks');

const client = new Discord.Client();
const token = 'Mzk5ODgwMTE4NzUyNzcyMDk2.DTTg5g.sPL5HDUfbAYXUUv6kZr5fv8LN8E';
const commands = new Commands();
cmdTanks.addCommands(commands);

client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {
  commands.handle(message);
});

db.init(path.join(__dirname, 'tanki.sqlite'))
  .catch(err => console.error(err.message, err.stack))
  .then(() => {
    commands.initialize();
    client.login(token);
  });

process.on('SIGINT', () => {
  db.finalize()
    .then(_ => process.exit());
});
