/*
    Bläkkisvuohi, a Telegram bot to help track estimated blood alcohol concentration.
    Copyright (C) 2017  Joonas Ulmanen

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/*
    context.js
    Simple way to 'remember' command context with users
*/

'use strict';

const log = require('loglevel').getLogger('system');
let contexts = module.exports = {};

contexts.Context = class {
    constructor(cmd, msg) {
        this.cmd = cmd;
        this.msg = msg;
        this.phase = 'start';
        this.variables = {};
        this.inline_ui = {
            state: null,
            parent: null
        };
    }

    privateReply(text) {
        let self = this;
        let options = {
            'parse_mode': 'Markdown',
            'reply_markup': {
                'remove_keyboard': true
            }
        };
        return self.msg.sendMessage(self.msg.from.id, text, options);
    }

    privateReplyWithKeyboard(text, keyboardButtons) {
        let self = this;
        let options = {
            'parse_mode': 'Markdown',
            'reply_markup': {
                'keyboard': keyboardButtons,
                'resize_keyboard': true
            }
        };
        return self.msg.sendMessage(self.msg.from.id, text, options);
    }

    inlineKeyboardMessage(text, inlineKeyboardButtons) {
        let self = this;
        log.debug('inlineKeyboardMessage', text, inlineKeyboardButtons);
        let options = {
            'parse_mode': 'Markdown',
            'reply_markup': {
                'inline_keyboard': inlineKeyboardButtons,
                'remove_keyboard': true
            }
        };
        return self.msg.sendMessage(self.msg.from.id, text, options);
    }

    inlineKeyboardEdit(text, inlineKeyboardButtons) {
        let self = this;
        let options = {
            'message_id': self.msg.message.message_id,
            'chat_id': self.msg.message.chat.id,
            'parse_mode': 'Markdown',
            'reply_markup': {
                'inline_keyboard': inlineKeyboardButtons,
                'remove_keyboard': true
            }
        };
        return self.msg.editMessageText(text, options);
    }

    chatReply(text) {
        let self = this;
        return self.msg.sendMessage(self.msg.chat.id, text);
    }

    photoReply(stream, caption) {
        let self = this;
        return self.msg.sendPhoto(self.msg.chat.id, stream, {
            caption: caption
        });
    }

    sendMessage(message) {
        if (!message || !message.type || !message.text) {
            return Promise.reject(new Error('invalid message object'));
        }
        let self = this;

        if (message.type === 'photo') {
            return self.msg.sendPhoto(self.msg.chat.id, message.buffer, message.options);
        } else {
            let to = message.type === 'private_message' ? self.msg.from : self.msg.chat;
            return self.msg.sendMessage(to.id, message.text, message.options);
        }
    }

    setInlineState(state) {
        this.inline_ui.state = state;
    }

    get state() {
        return this.inline_ui.state;
    }

    storeVariable(key, value) {
        this.variables[key] = value;
    }

    fetchVariable(key) {
        return this.variables[key];
    }

    forgetVariable(key) {
        this.variables[key] = undefined;
    }

    toPhase(phase) {
        this.phase = phase;
    }

    end() {
        this.phase = -1;
        this.variables = 0;
        return Promise.resolve();
    }

    isPrivateChat() {
        return this.msg.chat && this.msg.chat.type === 'private' || this.msg.message && this.msg.message.chat.type === 'private';
    }

    hasEnded() {
        return this.phase === -1;
    }
};