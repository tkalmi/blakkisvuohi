'use strict';

exports.up = (pgm) => {
    pgm.createTable('users', {});
};

exports.down = (pgm) => {
    pgm.dropTable('users', {ifExists: true});
