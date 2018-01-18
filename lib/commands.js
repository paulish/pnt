const db = require('./db');
class Commands {
    constructor() {
        this.re = /^\!([a-zа-я]+)\s*(.+)?$/;
        this.commands = {};
        this.textHandler = null;
        this.builtIn = [{
            name: 'помощь',
            help: 'получение справки о командах',
            handler: (args) => {
                let text = [];
                for (let cmd in this.commands) {
                    let command = this.commands[cmd];
                    if (this.hasCommand(cmd) && command.help) {
                        var cmdText = `\!${cmd}`;
                        if (command.args) {
                            cmdText += ' ' + command.args;
                        }
                        text.push(cmdText + ' - ' + command.help);
                    }
                }
                args.message.channel.send('```Markdown\n' + text.join('\n') + '```');
            }
        }]
    }

    initialize() {
        let res = {};
        let commands = this.builtIn;
        for (var cmd of commands) {
            res[cmd.name] = this.buildCommand(cmd);
        };
        this.commands = res;        
    }

    hasCommand(cmd) {
        var hasCommand = this.commands.hasOwnProperty(cmd);
        return hasCommand;
    }

    handle(message) {
        let match = message.content.match(this.re);
        if (match) {
            let cmd = match[1].toLowerCase();
            if (!this.hasCommand(cmd)) {
                return message.reply('Неизвестная команда. Напиши !помощь для получения списка команд.');
            }
            return this.commands[cmd].handler.call(undefined, message, match[2]);
        } else
            if (this.textHandler) {
                this.textHandler(this, message);
            }
    }

    getArgumentsString(args) {
        if (typeof args === 'undefined') {
            return;
        }
        let arr = [], str;
        for (let arg of args) {
            if (arg.help) {
                str = arg.help;
            } else if (arg.values) {
                str = arg.values.join('|');
            } else {
                str = arg.name;
            }
            if (arg.required === true) {
                arr.push('<' + str + '>');
            } else {
                arr.push('[' + str + ']');
            }
        };
        return arr.join(' ');
    }

    parseArguments(str, args) {
        let res = {};
        if (typeof args === 'undefined') {
            return str ? false : res;
        }
        const nextValue = (fullText) => {
            let res;
            if (str) {
                if (fullText) {
                    res = str;
                    str = '';
                } else {
                    const re = /^([^\s"]+|"[^"]*")+/g;
                    res = re.exec(str);
                    if (res === null) {
                        return false;
                    } else {
                        res = res[0];
                        str = str.slice(re.lastIndex).trimLeft();
                    }
                    if (res && (res.charAt(0) === '"')) {
                        res = res.slice(1, res.length - 1);
                    }
                }
            } else {
                res = false;
            }
            return res;
        };
        let arg, s, value = false;
        for (let i = 0; i < args.length; i++) {
            arg = args[i];
            if (!value) {
                value = nextValue(arg.fullText);
            }
            if (value === false) {
                if (arg.required) {
                    return false;
                } else {
                    continue;
                }
            }
            if (arg.values) {
                s = value.toLowerCase();
                if (arg.values.indexOf(s) !== -1) {
                    value = false;
                    if (arg.value === true) {
                        res[arg.name] = nextValue();
                        if (res[arg.name] === false) {
                            return false;
                        }
                    } else {
                        res[arg.name] = s;
                    }
                } else if (arg.required === true) {
                    return false;
                }
            } else {
                res[arg.name] = value;
                value = false;
            }
        }
        if (str || (value !== false)) {
            // if we have some leftovers in our command string then it is an error
            res = false;
        }
        return res;
    }

    buildCommand(cmd) {
        let args = this.getArgumentsString(cmd.arguments);
        return {
            help: cmd.help,
            args: args,
            handler: (message, extra) => {
                let functionArgs = this.parseArguments(extra, cmd.arguments);
                if (functionArgs === false) {
                    // error in arguments
                    let text = cmd.name;
                    if (args) {
                        text += ' ' + args;
                    }
                    message.reply('Использование: !' + text);
                } else {
                    functionArgs.message = message;
                    if (cmd.handler) {
                        cmd.handler.call(cmd.scope || this, functionArgs);
                    }
                }
            }
        };
    }
};

module.exports = Commands;