'use strict';

// connect to the database
const db = require('./database');

// Import the configurations
const config = require('./config');
const helper = require('./helper');

// Import crypto functions
const CryptoJS = require("crypto-js");

// Success and failure empty json objects
const failure_default_json = { success: 0};

/**
 * Core functions
 */
function uploadMc(req, res) {
  if (!req.files) {
    return res.status(400).send(failure_default_json);
  }

  let mcFile = req.files.MC;
  // Generate a random filename
  let randString = Math.random().toString(36).slice(-5);

  // Get the file extension
  let fileExtension;

  let pos = mcFile.mimetype.lastIndexOf('/');
  if (mcFile.mimetype.slice(pos+1) == 'pdf') {
    fileExtension = 'pdf';
  } else {
    // based on client side file type restriction
    fileExtension = 'jpg';
  }

  let fileName = `${randString}.${fileExtension}`;

  mcFile.mv(`${config.mc_upload_path}/${fileName}`, function(err) {
    if (err) {
      return res.status(500).send(failure_default_json);
    } else {
      let result = {
        success: 1,
        mc: fileName,
      };
      helper.debug_print(`${req.originalUrl}: Sending ${JSON.stringify(result)}`);
      res.send(result);
    }
  })
}

/**
 * Login to the server
 */
function login(req, res) {
  let sql = `SELECT id, password FROM employees WHERE status = 1 and id = ?`;
  let params = [req.body.id];

  db.getWithPromise(sql, params).then(function(row) {
    let result;

    if (row) {
      let encryptedUserPassword = CryptoJS.MD5(req.body.password).toString();
      if (encryptedUserPassword === row.password) {
        console.log("Login succeeded");
        result = {
          success: 1,
          employee_id: row.id
        };
      } else {
        result = failure_default_json;
      }
    } else {
      result = failure_default_json;
    }

    res.send(result);
  }, function(err) {
    console.error(err.message);
  });
}

/**
 * Get employee details by id
 */
function getEmployeeDetails(req, res) {
  let sql = `SELECT id, first_name, last_name, status, supervisor, picture, designation FROM employees WHERE status = 1 and id = ?`;
  let params = [req.params.id]

  db.getWithPromise(sql, params).then(function(row) {
    let result;

    if (row) {
      helper.debug_print(`${req.originalUrl}: Successfully retrieved data`);
      result = {
        success: 1,
        id: row.id,
        first_name: row.first_name,
        last_name: row.last_name,
        status: row.status,
        supervisor: row.supervisor,
        picture: row.picture,
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
}

/**
 * Get the role of the employee by id
 */
function getEmployeeRole(req, res) {
  let sql = `SELECT count(*) as c FROM employees WHERE supervisor = ?`;
  let params = [req.params.id]

  db.getWithPromise(sql, params).then(function(row) {
    let result;

    if (row.c > 0) {
      result = {
        success: 1,
        role: 'supervisor'
      };
    } else {
      result = {
        success: 1,
        role: 'employee'
      };
    }

    helper.debug_print(`${req.originalUrl}: ${JSON.stringify(row)}`);
    res.send(result);
  }, function(err) {
    console.error(err.message);
  });
}

/**
 * Get the tasks assigned to employee by id
 */
function getEmployeeTasks(req, res) {
  let sql = `SELECT id, employee_id, name, details, deadline FROM tasks WHERE employee_id = ? ORDER BY deadline`;
  let params = [req.params.id];

  db.conn.all(sql, params, function(err, rows) {
    let result = {
      success: 1,
      tasks: []
    };

    if (err) {
      console.error(err.message);
    } else {
      rows.forEach(function(row) {
        let task = {
          id: row.id,
          employee_id: row.employee_id,
          name: row.name,
          details: row.details,
          deadline: row.deadline
        };

        result.tasks.push(task);
      });

      helper.debug_print(`${req.originalUrl}: Sending ${JSON.stringify(result)}`);
      res.send(result);
    }
  });
}

/*
 * Get leaves by supervisor id
 */
function getLeavesBySupervisorId(req, res) {
  let sql = `SELECT employees.id employee_id, employees.first_name, employees.last_name, medical_leaves.id leave_id FROM employees JOIN medical_leaves ON medical_leaves.employee_id = employees.id AND employees.supervisor = ?`;
  let params = [req.params.id];

  if (req.query.status) {
    sql += `AND medical_leaves.status = ?`;
    params.push(req.query.status);
  }

  if (req.query.notstatus) {
    sql += `AND medical_leaves.status != ?`;
    params.push(req.query.notstatus);
  }

  db.conn.all(sql, params, function(err, rows) {
    let result = {
      success: 1,
      leaves: []
    };

    if (err) {
      console.error(err.message);
    } else {
      rows.forEach(function(row) {
        let leave = {
          leave_id: row.leave_id,
          employee_id: row.employee_id,
          first_name: row.first_name,
          last_name: row.last_name,
        };

        result.leaves.push(leave);
      });

      helper.debug_print(`${req.originalUrl}: Sending ${JSON.stringify(result)}`);
      res.send(result);
    }
  });
}

/*
 * Get leaves by employee id
 */
function getLeavesByEmployeeId(req, res) {
  let sql = `SELECT id, employee_id, remarks, from_date, to_date, status, mc, clinic_id FROM medical_leaves WHERE employee_id = ?`;
  let params = [req.params.id];

  if (req.query.status) {
    sql += `AND status = ?`;
    params.push(req.query.status);
  }

  if (req.query.notstatus) {
    sql += `AND status != ?`;
    params.push(req.query.notstatus);
  }

  sql += ` ORDER BY from_date DESC`;

  db.conn.all(sql, params, function(err, rows) {
    let result = {
      success: 1,
      leaves: []
    };

    if (err) {
      console.error(err.message);
    } else {
      rows.forEach(function(row) {
        let leave = {
          id: row.id,
          employee_id: row.employee_id,
          remarks: row.remarks,
          from_date: row.from_date,
          to_date: row.to_date,
          status: row.status,
          mc: row.mc,
          clinic_id: row.clinic_id
        };

        result.leaves.push(leave);
      });

      helper.debug_print(`${req.originalUrl}: Sending ${JSON.stringify(result)}`);
      res.send(result);
    }
  });
}

/**
 * Create new leave (inform)
 */
function createMedicalLeave(req, res) {
  // Get the json object from the request data
  helper.debug_print(JSON.stringify(req.body));

  let sql = 'INSERT INTO medical_leaves (';
  let fields = ['employee_id', 'remarks', 'from_date', 'to_date', 'mc', 'clinic_id'];
  let params = [];
  let placeholder = '';

  fields.forEach(function(field) {
    let value = req.body[field];

    if (value) {
      sql += `${field}, `;
      params.push(value);
      placeholder += '?, ';
    }
  });

  sql += `status) values (${placeholder} ${config.leave_status['pending']})`;

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
}

/**
 * Route for get and update leave by id
 */
function getMedicalLeaveById(req, res) {
  // Return leave details
  helper.debug_print(req.params.id);
  let sql = `SELECT id, employee_id, remarks, from_date, to_date, status, mc, clinic_id FROM medical_leaves`;
  let params = [];

  if (req.params.id == 'all') {

    if (req.query.status) {
      if (sql.search('WHERE') == -1) {
        sql += `WHERE status = ?`;
      } else {
        sql += `AND status = ?`;
      }
    }

    db.conn.all(sql, params, function(err, rows) {
      if (err) {
        console.error(err.message);
      } else {
        let result = {
          success: 1,
          leaves: []
        };

        rows.forEach(function(row) {
          let leave = {
            id: row.id,
            employee_id: row.employee_id,
            remarks: row.remarks,
            from_date: row.from_date,
            to_date: row.to_date,
            status: row.status,
            mc: row.mc,
            clinic_id: row.clinic_id
          };

          result.leaves.push(leave);
        });

        helper.debug_print(`${req.originalUrl}: Sending ${JSON.stringify(result)}`);
        res.send(result);
      }
    });
  } else {
    sql += ` WHERE id = ?`;
    params = [req.params.id];

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
  }
}

function updateMedicalLeaveById(req, res) {
  // Generate the query based on the input params
  let sql = 'UPDATE medical_leaves SET';
  let fields = ['employee_id', 'remarks', 'from_date', 'to_date', 'status', 'mc', 'clinic_id'];
  let params = [];

  fields.forEach(function(field) {
    let value = req.body[field];

    if(value) {
      sql += ` ${field}=?,`;
      params.push(value);
    }
  });

  sql += ' WHERE id = ?';

  // Find the last , and slice it off
  let pos = sql.lastIndexOf(',');
  sql = `${sql.slice(0, pos)} ${sql.slice(pos+1)}`;

  // Push the leave request id to the params
  params.push(req.params.id);

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
}

function getClinicById(req, res) {
  let sql;
  let params;

  if (req.params.id == 'all') {
    sql = `SELECT id, name, address, contact_no, status FROM clinics WHERE status = 1 ORDER BY name`;
    params = [];

    db.conn.all(sql, params, function(err, rows) {
      if (err) {
        console.error(err.message);
      } else {

        let result = {
          success: 1,
          clinics: []
        };

        rows.forEach(function(row) {
          let clinic = {
            id: row.id,
            name: row.name,
            address: row.address,
            contact_no: row.contact_no,
            status: row.status
          };

          result.clinics.push(clinic);
        });

        helper.debug_print(`${req.originalUrl}: Sending ${JSON.stringify(result)}`);
        res.send(result);
      }
    });
  } else {
    sql = `SELECT id, name, address, contact_no, status FROM clinics WHERE id = ? AND status = ?`;
    params = [req.params.id, 1];

    db.getWithPromise(sql, params).then(function(row) {
      let result;

      if (row) {
        result = {
          success: 1,
          id: row.id,
          name: row.name,
          address: row.address,
          contact_no: row.contact_no,
          status: row.status
        };
      } else {
        result = failure_default_json;
      }

      helper.debug_print(`${req.originalUrl}: Sending ${JSON.stringify(result)}`);
      res.send(result);
    }, function(err) {
      console.error(err.message);
    });
  }
}

module.exports.uploadMc = uploadMc;
module.exports.login = login;
module.exports.getEmployeeDetails = getEmployeeDetails;
module.exports.getEmployeeRole = getEmployeeRole;
module.exports.getEmployeeTasks = getEmployeeTasks;
module.exports.getLeavesByEmployeeId = getLeavesByEmployeeId;
module.exports.getLeavesBySupervisorId = getLeavesBySupervisorId;
module.exports.createMedicalLeave = createMedicalLeave;
module.exports.getMedicalLeaveById = getMedicalLeaveById;
module.exports.updateMedicalLeaveById = updateMedicalLeaveById;
module.exports.getClinicById = getClinicById;
