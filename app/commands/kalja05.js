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
    /kalja05
    Drink one 0.5l 4.7% beer
*/
'use strict';
const when = require('when');
const log = require('loglevel').getLogger('commands');
const Commands = require('../lib/commands.js');
const utils = require('../lib/utils.js');
const constants = require('../constants.js');
const strings = require('../strings.js');

function kalja05Command(context, user, msg, words) {
    let deferred = when.defer();
    user.drinkBoozeReturnEBAC(constants.KALJA05, '/kalja05', msg)
        .then((ebac) => {
            const permilles = ebac.permilles;
            const permilles30Min = ebac.permilles30Min;
            const text = utils.getRandom(strings.drink_responses) + ' ' + strings.short_permilles_text.format({
                permilles: utils.roundTo(permilles, 2),
                permilles30Min: utils.roundTo(permilles30Min, 2)
            });
            deferred.resolve(context.privateReply(text));
        }, (err) => {
            log.error(err);
            log.debug(err.stack);
            deferred.reject('Isompi ongelma, ota yhteyttä adminiin.');
        });
    context.end();
    return deferred.promise;
}

Commands.registerUserCommand(
    '/kalja05',
    strings.commands.kalja05.cmd_description,
    Commands.TYPE_PRIVATE, [kalja05Command]
);