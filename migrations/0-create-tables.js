'use strict';

exports.up = (pgm) => {
    pgm.createTable('users', {});
    pgm.createTable('users_drinks', {});
    pgm.createTable('users_in_groups', {});
};

exports.down = (pgm) => {
    pgm.dropTable('users', {ifExists: true});
    pgm.dropTable('users_drinks', {ifExists: true});
    pgm.dropTable('users_in_groups', {ifExists: true});
};
