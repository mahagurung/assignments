'use strict';

// Listener configs
const ip = '0.0.0.0';
const port = 3000;

// Encryption key
const secret = 'mysuperstrongsecret';

// Database settings
const db_file = './database.db';

// Debug log
const debug = true;

// Leave request status
const leave_status = {
  pending: 0, // Pending approval
  approved: 1, // Approved
};

//MC upload path
const mc_upload_path = './uploads';

module.exports.ip = ip;
module.exports.port = port;
module.exports.db_file = db_file;
module.exports.debug = debug;
module.exports.leave_status = leave_status;
module.exports.mc_upload_path = mc_upload_path;
module.exports.secret = secret;
