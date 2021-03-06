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
    /kalja033
    Drink one 0.33l 4.7% beer
*/
'use strict';

const log = require('loglevel').getLogger('commands');
const Commands = require('../lib/commands.js');
const utils = require('../lib/utils.js');
const constants = require('../constants.js');
const strings = require('../strings.js');

function kaljaCommand(context, msg, words, user) {
    return user.drinkBoozeReturnEBAC(constants.KALJA033, '/kalja033', msg)
        .then((ebac) => {
            const permilles = ebac.permilles;
            const permilles30Min = ebac.permilles30Min;
            const text = utils.getRandomFromArray(strings.drink_responses) + ' ' + strings.short_permilles_text.format({
                permilles: utils.roundTo(permilles, 2),
                permilles30Min: utils.roundTo(permilles30Min, 2)
            });
            return context.privateReply(text);
        });
}

Commands.register(
    '/kalja033',
    strings.commands.kalja033.cmd_description,
    Commands.SCOPE_PRIVATE,
    Commands.PRIVILEGE_USER,
    Commands.TYPE_SINGLE,
    kaljaCommand
);