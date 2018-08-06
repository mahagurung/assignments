"use strict"

/*
 * JSON file format
 * {
 *  clinics: [{
 *    name: "Clinic name",
 *    address: "Clinic address",
 *    contact_no: "Contact no"
 *    },..
 *  ]
 * }
 */

const db = require("./database.js");
const helper = require("./helper.js");

const fs = require("fs");
const options = process.argv.slice(2);

const filename = options[0];
const mode = options[1]; // reset, append

try {
  console.log(`Updating clinic list from file ${filename}`);

  let contents = fs.readFileSync(filename);
  let jsonContent = JSON.parse(contents);

  if (mode === "reset") {
    let sql = 'UPDATE clinics SET status = 0';
    let params = [];

    db.runWithPromise(sql, params).then(function(that) {
      let result = {
        success: 1,
        rows_updated: that.changes
      };

      helper.debug_print(JSON.stringify(result));
    }, function(err) {
      throw Error(err.message);
    });
  }

  let sql = 'INSERT INTO clinics (name, address, contact_no, status) values';
  let params = [];
  let placeholder = '';

  jsonContent.clinics.forEach(function(clinic) {
    placeholder += ' (?, ?, ?, ?),';
    params.push(clinic.name);
    params.push(clinic.address);
    params.push(clinic.contact_no);
    params.push(1);
  });

  // Remove the last char (,)
  sql += placeholder.slice(0, -1);

  db.runWithPromise(sql, params).then(function(that) {
    let result = {
      success: 1
    };

    helper.debug_print(JSON.stringify(result));
    console.log("Clinic list updated!");
  }, function(err) {
    throw Error(err.message)
  });
} catch(error) {
  console.error(error)
}

