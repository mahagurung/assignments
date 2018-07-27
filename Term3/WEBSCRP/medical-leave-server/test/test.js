const expect = require('chai').expect;
const request = require('request');
const config = require('../lib/config');

const baseUrl = "http://localhost:" + config.port;
const failureEmptyJson = { success: 0 };

// Connect to database
const db = require('../lib/database');

/**
 * Test cases
 */

describe('Employee details', function() {
  let apiEndpoint = `${baseUrl}/employee`;

  it('Should retrieve details of employee with id 500101', function(done) {
    let expected = {
      success: 1,
      employee_id: 500101,
      name: "Marketa Sorbey",
      picture: "http://localhost:3000/images/500101.jpg",
      designation: "CEO"
    };

    let options = {
      uri: `${apiEndpoint}/500101`,
      json: true
    };

    request.get(options, function(err, res, result) {
      if (err) {
        done(err);
      } else {
        expect(expected).to.deep.equal(result);
      }
    });
    done();
  })

  it('Should return failure json for employee with id 0', function(done) {
    let options = {
      uri: `${apiEndpoint}/0`,
      json: true
    };

    request.get(options, function(err, res, result) {
      if (err) {
        done(err);
      } else {
        expect(failureEmptyJson).to.deep.equal(result);
      }
    });
    done();
  });

  it('Should return role of employee id 500101 as supervisor', function(done) {
    let options = {
      uri: `${apiEndpoint}/role/500101`,
      json: true
    };

    request.get(options, function(err, res, result) {
      if (err) {
        done(err);
      } else {
        expect(result.role).to.equal('supervisor');
      }
    });
    done();
  });

  it('Should return role of employee id 500108 as employee', function(done) {
    let options = {
      uri: `${apiEndpoint}/role/500109`,
      json: true
    };

    request.get(options, function(err, res, result) {
      if (err) {
        done(err);
      } else {
        expect(result.role).to.equal('employee');
      }
    });
    done();
  });
});


describe('Leave requests', function () {
  let apiEndpoint = `${baseUrl}/medicalleave`;

  // Variable to retain the new leave request's id
  let rowId;

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

    request.post(options, function(err, res, result) {
      if (err) {
        done(err);
      } else {
        rowId = result.leave_id;

        let sql = `SELECT id, remarks, from_date, employee_id FROM medical_leaves WHERE id = ?`;
        db.conn.get(sql, [rowId], function (err, row) {
          if (err) {
            done(err);
          } else {
            expect(row.remarks).to.deep.equal("Testing leave request api");
          }
        });
      }
      done();
    });
  });

  it('Get leave request by id', function (done) {
    let options = {
      uri: `${apiEndpoint}/${rowId}`,
      json: true
    };

    request.get(options, function(err, res, result) {
      if (err) {
        done(err);
      } else {
        expect(result.remarks).to.deep.equal("Testing leave request api");
      }
    });
    done();
  });

  it('Update leave request by id', function (done) {
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

    request.put(options, function(err, res, result) {
      if (err) {
        done(err);
      } else {
        expect(result.rows_updated).to.equal(1);
      }
    });
    done();
  });

  /*
  // Cleanup
  it('Cleanup test data', function(done) {
    let sql = `DELETE FROM medical_leaves where id = ?`;
    db.conn.run(sql, [rowId], (err) => {
      if (err) {
        done(err);
      }
    });
    done();
  });
  */
});
