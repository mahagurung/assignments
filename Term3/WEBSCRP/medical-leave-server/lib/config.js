'use strict';


// Port to listen to
const port = 3000;

// Database settings
const db_file = './database.db';

// Debug log
const debug = true

// Leave request status
const leave_status = {
  rejected: 0, // Rejected by supervisor
  pending: 1, // Pending approval
  approved: 2, // Approved, mc pending
  completed: 3, // MC uploaded
}

module.exports.port = port;
module.exports.db_file = db_file;
module.exports.debug = debug;
module.exports.leave_status = leave_status;
