'use strict';

const utils = require('./utils.js');

let cmd = {};

let cmds = {};
cmd.TYPE_PRIVATE = 'private';
cmd.TYPE_ALL = 'all';

cmd.register = function register(cmd, type, func, help) {
  console.log('Added command ' + cmd + ' : (' + type + ')');
  cmds[cmd] = {
    type: type,
    func: func,
    help: help
  };
};

cmd.call = function call(cmdName, msg, words) {
  utils.attachMethods(msg);
  if(cmds[cmdName]){
    try {
      console.log(cmds[cmdName]);
      if(cmds[cmdName].type === cmd.TYPE_PRIVATE && msg.chat.type !== 'private'){
        msg.sendPrivateMsg('Käytä komentoa vain minun kanssa! Komennon käyttö: ' + cmds[cmdName].help);
        return;
      }
      cmds[cmdName].func(msg, words);
    } catch (err) {
      console.log('Couldn\'t execute cmd "'+cmdName+'"! ' + err);
      msg.sendMsg('Virhe! Komennon käyttö: ' + cmds[cmdName].help);
    }
  } else if (cmdName === '/komennot'|| cmdName === '/start' || cmdName === '/help') {
    let cmdstr = 'Komennot:\n';
    for(var i in cmds){
      cmdstr += cmds[i].help + '\n';
    }
    msg.sendPrivateMsg(cmdstr);
  }
};

module.exports = cmd;
