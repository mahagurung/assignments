const expect = require('chai').expect;
const request = require('request');
const config = require('../lib/config');

const baseUrl = "http://localhost:" + config.port;

// Connect to database
const db = require('../lib/database');

/**
 * Test cases
 */

describe('Employee details', function() {
  let apiEndpoint = `${baseUrl}/employee`;

  it('Should retrieve details of employee with id 500101', function(done) {
    let options = {
      uri: `${apiEndpoint}/500101`,
      json: true
    };

    request.get(options, function(err, res, body) {
      if (err) {
        done(err);
      } else {
        expect(body.id).to.equal(500101);
        done();
      }
    });
  })

  it('Should fail gracefully for employee with id 0', function(done) {
    let options = {
      uri: `${apiEndpoint}/0`,
      json: true
    };

    request.get(options, function(err, res, body) {
      if (err) {
        done(err);
      } else {
        expect(body.success).to.equal(0);
        done();
      }
    });
  });

  it('Should return role of employee id 500101 as supervisor', function(done) {
    let options = {
      uri: `${apiEndpoint}/role/500101`,
      json: true
    };

    request.get(options, function(err, res, body) {
      if (err) {
        done(err);
      } else {
        expect(body.role).to.equal('supervisor');
        done();
      }
    });
  });

  it('Should return role of employee id 500108 as employee', function(done) {
    let options = {
      uri: `${apiEndpoint}/role/500109`,
      json: true
    };

    request.get(options, function(err, res, body) {
      if (err) {
        done(err);
      } else {
        expect(body.role).to.equal('employee');
        done();
      }
    });
  });

  it('Should return all tasks allocated to employee id 500109', function(done) {
    let options = {
      uri: `${apiEndpoint}/tasks/500109`,
      json: true
    };

    request.get(options, function(err, res, body) {
      if (err) {
        done(err);
      } else {
        expect(body.tasks).to.be.an('array').that.is.not.empty;
        expect(body.tasks[0].employee_id).to.equal(500109);
        done();
      }
    });
  });
});


describe('Leave requests', function() {
  let apiEndpoint = `${baseUrl}/medicalleave`;
  let rowId; // Variable to retain the new leave request's id

  it('Create new leave request', function(done) {
    let reqJson = {
      remarks: "Testing leave request api",
      from_date: "2017-11-26 00:00:00",
      employee_id: "500101"
    };

    let headers = {
      'User-Agent': 'Test Script/0.0.1',
      'Content-Type': 'application/json'
    };

    let options = {
      uri: `${apiEndpoint}/inform`,
      headers: headers,
      body: reqJson,
      json: true
    };

    request.post(options, function(err, res, body) {
      if (err) {
        done(err);
      } else {
        rowId = body.leave_id;

        let sql = `SELECT id, remarks, from_date, employee_id FROM medical_leaves WHERE id = ?`;
        db.conn.get(sql, [rowId], function(err, row) {
          if (err) {
            done(err);
          } else {
            expect(row.remarks).to.deep.equal("Testing leave request api");
            done();
          }
        });
      }
    });
  });

  it('Get leave request by id', function(done) {
    let options = {
      uri: `${apiEndpoint}/${rowId}`,
      json: true
    };

    request.get(options, function(err, res, body) {
      if (err) {
        done(err);
      } else {
        expect(body.id).to.equal(rowId);
        done();
      }
    });
  });

  it('Update leave request by id', function(done) {
    let reqJson = {
      remarks: "Testing update leave request api",
      from_date: "2017-11-26 00:00:00",
      to_date: "2017-11-27 23:59:59",
      status: 2,
      clinic_id: 1,
      mc: "/uploads/500501_2017-11-26.jpg"
    };

    let headers = {
      'User-Agent': 'Test Script/0.0.1',
      'Content-Type': 'application/json'
    };

      let options = {
        uri: `${apiEndpoint}/${rowId}`,
      headers: headers,
      body: reqJson,
      json: true
    };

    request.put(options, function(err, res, body) {
      if (err) {
        done(err);
      } else {
        expect(body.rows_updated).to.equal(1);
        done();
      }
    });
  });

  // Cleanup
  it('Cleanup test data', function(done) {
    let sql = `DELETE FROM medical_leaves where id = ?`;
    db.conn.run(sql, [rowId], (err) => {
      if (err) {
        done(err);
      }
      done();
    });
  });
});

describe('Clinics', function() {
  let apiEndpoint = `${baseUrl}/clinics`;

  it('Should return all the clinics in the database', function(done) {
    let options = {
      uri: `${apiEndpoint}/all`,
      json: true
    };

    request.get(options, function(err, res, body) {
      if (err) {
        done(err);
      } else {
        expect(body.clinics).to.be.an('array').that.is.not.empty;
        done();
      }
    });
  });

  it('Should return the details of clinic with id 1', function(done) {
    let options = {
      url: `${apiEndpoint}/1`,
      json: true
    };

    request.get(options, function(err, res, body) {
      if (err) {
        done(err);
      } else {
        expect(body.id).to.equal(1);
        done();
      }
    });
  });
});
