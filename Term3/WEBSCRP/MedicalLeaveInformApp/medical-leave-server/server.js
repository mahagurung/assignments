'use strict';

const express = require('express');
const uploader = require('express-fileupload');

// Import the configurations
const config = require('./lib/config');

// Import the core functions
const core = require('./lib/core.js');

// Intialise express and define the json body parser
const app = express();
app.use(express.json());

// Enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Use express-fileupload for file uploads
app.use(uploader());

// Define the static paths for images and uploads
app.use('/uploads', express.static('uploads'));
app.use('/images', express.static('images'));

/**
 * Start the server
 */
app.listen(config.port, config.ip, function () {
  console.log(`Server started on port ${config.port}`);
});

/**
 * Create the api endpoints
 */
app.post('/upload/mc', core.uploadMc);
app.post('/login', core.login);
app.get('/employee/:id', core.getEmployeeDetailsById);
app.get('/employee', core.getEmployeeDetailsByParams);
app.get('/employee/role/:id', core.getEmployeeRole);
app.get('/employee/tasks/:id', core.getEmployeeTasks);
app.get('/employee/leaves/:id', core.getLeavesByEmployeeId);
app.get('/supervisor/leaves/:id', core.getLeavesBySupervisorId);
app.post('/medicalleave/inform', core.createMedicalLeave);
app.route('/medicalleave/:id')
  .get(core.getMedicalLeaveById)
  .put(core.updateMedicalLeaveById);
app.get('/clinics/:id', core.getClinicById);
