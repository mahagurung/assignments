'use strict';

const config = require('./config');

module.exports.debug_print = function (msg) {
  if (config.debug) {
    console.log(msg);
  }
};
