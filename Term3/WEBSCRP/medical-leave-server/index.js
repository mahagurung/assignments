'use strict';

const express = require('express');
const sqlite3 = require('sqlite3').verbose();

// Import the configurations
const config = require('./config');
const helper = require('./helper');

// Intialise express and define the json body parser
const app = express();
app.use(express.json());

// Define the static paths for images and uploads
app.use('/uploads', express.static('uploads'));
app.use('/images', express.static('images'));


// connect to the database
const db = new sqlite3.Database(config.db_file, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log(`Connected to the database using file ${config.db_file}.`);
});

// Success and failure empty json objects
const success_default_json = JSON.parse('{ "success": 1}');
const failure_default_json = JSON.parse('{ "success": 0}');


/**
 * Get employee details by id
 */
app.get('/employee/:id', (req, res) => {
  let sql = `SELECT id, first_name, last_name, picture, designation FROM employees WHERE status = 1 and id = ?`;
  let result;

  db.serialize(() => {
    db.get(sql, [req.params.id], (err, row) => {
      if (err) {
        console.error(err.message);
      }
      if (row) {
        helper.debug_print("Successfully retrieved data");
        result = JSON.parse(`{ "success": 1,
                                "employee_id": ${row.id},
                                "name": "${row.first_name} ${row.last_name}",
                                "picture": "${req.protocol}://${req.get('host')}${row.picture}",
                                "designation": "${row.designation}" }`);
      } else {
        helper.debug_print("No such id exists");
        result = failure_default_json;
      }

      helper.debug_print(`Sending ${JSON.stringify(result)}`);
      res.send(result);
    });
  });
});

/**
 * Create new leave (inform)
 */
app.post('/medicalleave/inform', (req, res) => {
  // Get the json object from the request data
  helper.debug_print(JSON.stringify(req.body));

  let sql = `INSERT INTO medical_leaves (remarks, from_date, employee_id, status) values (?, ?, ?, ${config.leave_status['pending']})`;
  let result;

  db.serialize(() => {
    db.run(sql, [req.body.remarks, req.body.from_date, req.body.employee_id], (err) =>{
        if (err) {
            console.error(err.message);
        }
    })
  });
  res.send(success_default_json);
});

/**
 * Route for get and update leave by id
 */
app.route('/medicalleave/:id')
  .get((req, res) => {
    // Return leave details
    helper.debug_print(req.params.id);
    let sql = `SELECT id, remarks, employee_id, from_date, to_date, status, mc FROM medical_leaves WHERE id = ?`;
    let result;

    db.serialize(() => {
      db.get(sql, [req.params.id], (err, row) => {
        if (err) {
          console.error(err.message);
        }

        if (row) {
          result = JSON.parse(`{ "success": 1,
                                  "id": ${row.id},
                                  "remarks": "${row.remarks}",
                                  "employee_id": ${row.employee_id},
                                  "from_date": "${row.from_date}",
                                  "to_date": "${row.to_date}",
                                  "status": ${row.status},
                                  "clinic_id": ${row.clinic_id},
                                  "mc": "${req.protocol}://${req.get('host')}${row.mc}"}`);
        } else {
          result = failure_default_json;
        }

        helper.debug_print(JSON.stringify(result));
        res.send(result);
      });
    });
  })

  .put((req, res) => {
    // Update leave details
    let sql = `UPDATE medical_leaves SET remarks = ?, from_date = ?, to_date = ?, status = ?, clinic_id = ?, mc = ? WHERE id = ?`;

    db.serialize(() => {
      db.run(sql, [req.body.remarks, req.body.from_date, req.body.to_date, req.body.status, req.body.clinic_id, req.body.mc, req.params.id], (err) => {
        if (err) {
          console.error(err.message);
        } else {
          res.send(success_default_json);
        }
      });
    });
});

/**
 * Start the server
 */
app.listen(config.port, () => {
  console.log(`Server started on port ${config.port}`);
});

/**
 * Close database connection
 * Need to do this just before shutdown
db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Closed the database connection.');
});
*/
