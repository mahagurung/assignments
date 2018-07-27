// Import the configurations
const config = require('./config');
const helper = require('./helper');

// connect to the database
const sqlite3 = require('sqlite3').verbose();

const conn = new sqlite3.Database(config.db_file, function(err) {
  if (err) {
    console.error(err.message);
  }
  console.log(`Connected to the database using file ${config.db_file}.`);
});

let getWithPromise = function(sql, params) {
  helper.debug_print(`Running "${sql}" using ${params}`);
  return new Promise(function(resolve, reject) {
    conn.serialize(function () {
      conn.get(sql, params, function(err, row) {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  });
};

let runWithPromise = function(sql, params) {
  helper.debug_print(`Running "${sql}" using ${params}`);
  return new Promise(function(resolve, reject) {
    conn.serialize(function () {
      conn.run(sql, params, function(err) {
        if (err) {
            reject(err);
        } else {
          resolve(this);
        }
      });
    });
  });
};

module.exports.conn = conn;
module.exports.getWithPromise = getWithPromise;
module.exports.runWithPromise = runWithPromise;

/**
 * Close database connection
 * Need to do this just before shutdown

conn.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Closed the database connection.');
});
*/
