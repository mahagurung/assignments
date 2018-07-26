'use strict';

const express = require('express');

// Import the configurations
const config = require('./lib/config');
const helper = require('./lib/helper');

// connect to the database
const db = require('./lib/database');

// Intialise express and define the json body parser
const app = express();
app.use(express.json());

// Define the static paths for images and uploads
app.use('/uploads', express.static('uploads'));
app.use('/images', express.static('images'));


// Success and failure empty json objects
const failure_default_json = { success: 0};


/**
 * Get employee details by id
 */
app.get('/employee/:id', (req, res) => {
  let sql = `SELECT id, first_name, last_name, picture, designation FROM employees WHERE status = 1 and id = ?`;
  let params = [req.params.id]

  db.getWithPromise(sql, params).then(function(row) {
    let result;

    if (row) {
      helper.debug_print(`${req.originalUrl}: Successfully retrieved data`);
      result = {
        success: 1,
        employee_id: row.id,
        name: `${row.first_name} ${row.last_name}`,
        picture: `${req.protocol}:\/\/${req.get('host')}${row.picture}`,
        designation: row.designation
      };
    } else {
      helper.debug_print(`${req.originalUrl}: No such id exists`);
      result = failure_default_json;
    }

    helper.debug_print(`${req.originalUrl}: Sending ${JSON.stringify(result)}`);
    res.send(result);
  }, function(err) {
    console.error(err.message);
    // throw new Error(reason); Later add a global error handling function and uncomment this
  });
});

/**
 * Create new leave (inform)
 */
app.post('/medicalleave/inform', (req, res) => {
  // Get the json object from the request data
  helper.debug_print(JSON.stringify(req.body));

  let sql = `INSERT INTO medical_leaves (remarks, from_date, employee_id, status) values (?, ?, ?, ${config.leave_status['pending']})`;
  let params = [req.body.remarks, req.body.from_date, req.body.employee_id];

  db.runWithPromise(sql, params).then(function(that) {
    let result = {
      success: 1,
      leave_id: that.lastID
    };

    helper.debug_print(`${req.originalUrl}: Sending ${JSON.stringify(result)}`);
    res.send(result);
  }, function(err) {
    console.error(err.message);
    // throw new Error(reason);
  });
});

/**
 * Route for get and update leave by id
 */
app.route('/medicalleave/:id')
  .get((req, res) => {
    // Return leave details
    helper.debug_print(req.params.id);
    let sql = `SELECT id, remarks, employee_id, from_date, to_date, status, mc FROM medical_leaves WHERE id = ?`;
    let params = [req.params.id];

    db.getWithPromise(sql, params).then(function(row) {
      let result;

      if (row) {
        result = {
          success: 1,
          id: row.id,
          remarks: row.remarks,
          employee_id: row.employee_id,
          from_date: row.from_date,
          to_date: row.to_date,
          status: row.status,
          clinic_id: row.clinic_id,
          mc: `${req.protocol}:\/\/${req.get('host')}${row.mc}`
        };
      } else {
        result = failure_default_json;
      }

      helper.debug_print(`${req.originalUrl}: Sending ${JSON.stringify(result)}`);
      res.send(result);
    }, function(err) {
      console.error(err.message);
    });
  })

  .put((req, res) => {
    // Update leave details
    let sql = `UPDATE medical_leaves SET remarks = ?, from_date = ?, to_date = ?, status = ?, clinic_id = ?, mc = ? WHERE id = ?`;
    let params = [req.body.remarks, req.body.from_date, req.body.to_date, req.body.status, req.body.clinic_id, req.body.mc, req.params.id];

    db.runWithPromise(sql, params).then(function(that) {
      let result = {
        success: 1,
        rows_updated: that.changes
      };

      helper.debug_print(`${req.originalUrl}: Sending ${JSON.stringify(result)}`);
      res.send(result);
    }, function(err) {
      console.error(err.message);
    });
});

/**
 * Start the server
 */
app.listen(config.port, function () {
  console.log(`Server started on port ${config.port}`);
});