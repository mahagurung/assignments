"use strict";

const medicalLeaveServer = "http://localhost:3000";

/*
Leave request status
0: Pending Acknowledgement
1: Acknowledged by Supervisor
*/
const leaveStatus = ['Pending', 'MC Pending', 'MC Uploaded'];

/*
 * Generic Helper Functions
 */

function dateStringToObject(dateString) {
  let dateArray = dateString.split(/[- :]/);
  // Do a manipulation to the month index to match it with 0 indexing
  let month = String(Number(dateArray[1])-1);
  let dateObj = new Date(dateArray[0], month, dateArray[2]);
  return dateObj;
}

function dateObjectToString(dateObj) {
  /* A dirty hack to get padded month and date values*/
  let pad = "00";
  let padMonth = (pad+`${dateObj.getMonth()+1}`).slice(-pad.length);
  let padDate = (pad+`${dateObj.getDate()}`).slice(-pad.length);

  return `${dateObj.getFullYear()}-${padMonth}-${padDate}`;
}

function getNumberOfDays(fromDateString, toDateString) {
  let firstDate = dateStringToObject(fromDateString);

  if (toDateString) {
    let secondDate = dateStringToObject(toDateString);
    return Math.round((secondDate - firstDate)/(1000*60*60*24)) + 1;
  } else {
    /* return 1 if the to_date is not yet specified */
    return 1;
  }
}

function handleError(error) {
  // Right now just logging the error to console.
  console.error(error.message);
}

/**
 * UI Helper Functions
 */

function hideElement(elementId) {
  document.getElementById(elementId).classList.add('hidden');
}

function showElement(elementId) {
  document.getElementById(elementId).classList.remove('hidden');
}

function unSelectAllSidebarOptions() {
  const sidebarOptionIds = ['s_inform', 's_update', 's_myinfo', 's_clinics', 's_teaminfo', 's_pending', 's_logout'];
  sidebarOptionIds.forEach(function(sidebarId) {
    let ele = document.getElementById(sidebarId);
    ele.classList.remove('selected');
  });
}

function updateMainContentBox(htmlString) {
  const contentBox = document.querySelector('.main_b');
  contentBox.innerHTML = htmlString;
}

function createTable(pageTitle, tableHeading, tableBody) {
  let tableHtml = `<div class="page-title"><h4>${pageTitle}</h4><hr></div>
                   <div class="divTable blueTable">
                     <div class="divTableHeading">
                       <div class="divTableRow">
                         ${tableHeading}
                       </div>
                     </div>
                     <div class="divTableBody">
                       ${tableBody}
                     </div>
                   </div>`;

  return tableHtml;
}

function createLeavesTable(pageTitle, tableBody) {
  let tableHeading = `<div class="divTableHead smallColumn">No</div>
                      <div class="divTableHead mediumColumn">Date</div>
                      <div class="divTableHead largeColumn">Remarks</div>`;

  if (pageTitle == 'Pending') {
    tableHeading += '<div class="divTableHead mediumColumn">Status</div>';
  } else {
    tableHeading += '<div class="divTableHead mediumColumn">Days</div>';
  }

  let htmlString = createTable(pageTitle, tableHeading, tableBody);
  return htmlString;
}

function createClinicsTable(tableBody) {
  let tableHeading = `<div class="divTableHead smallColumn">No</div>
                      <div class="divTableHead mediumColumn">Name</div>
                      <div class="divTableHead largeColumn">Address</div>
                      <div class="divTableHead mediumColumn">Contact No</div>`;

  let htmlString = createTable("Clinics", tableHeading, tableBody);
  return htmlString;
}

function createUpdateLeaveForm(pageTitle, remarks, fromDate, clinicsHtml, leaveId) {
  let htmlString = `<div class="page-title"><h4>${pageTitle}</h4><hr></div>
                      <form class="generic-form" action="#">
                        <div class="login-form">
                          <label for="remarks">Remarks</label>
                          <textarea name="Remarks" id="remarks" rows="5" cols="50"
                            maxlength="200" wrap="hard" required autofocus>${remarks}</textarea>
                        </div>
                        <p></p>
                        <div class="login-form">
                          <label for="f_date">From</label>
                          <input type="date" name="From" id="f_date" value="${fromDate}" required>
                        </div>
                        <div class="login-form">
                          <label for="t_date">To</label>
                          <input type="date" name="To" id="t_date" required>
                        </div>
                        <div class="login-form">
                          <label for="mc">MC</label>
                          <input type="file" accept=".jpg, .jpeg, .pdf" name="MC" id="mc" required>
                        </div>
                        <div class="login-form">
                          <label for="clinics">Clinic</label>
                          <select name="Clinic" id="clinics">
                            ${clinicsHtml}
                          </select>
                        </div>
                        <div class="login-form">
                          <label></label>
                          <input class="generic-button" type="button" onclick="updateLeaveRequest(${leaveId})" value="Submit">
                        </div>
                      </form>`;

  return htmlString;
}

/*
 * Fetch api's with async/await
 */

const headers = {'Content-Type': 'application/json'};

async function asyncFetchCore(url, options) {
  let response = await fetch(url, options);
  if (!response.ok) {
    throw Error(response.statusText);
  } else {
    let jsonResponse = await response.json();
    return jsonResponse;
  }
}

async function asyncFetchGet(url) {
  let options = {};
  let fullUrl = medicalLeaveServer + url;
  let response = await asyncFetchCore(fullUrl, options);
  return response;
}

async function asyncFetchPost(url, data) {
  let fullUrl = medicalLeaveServer + url;
  let options = { method: 'POST' };

  if (url.startsWith('/upload')) {
    options.body = data;
  } else {
    options.body = JSON.stringify(data);
    options.headers = headers;
  }

  let response = await asyncFetchCore(fullUrl, options);
  return response;
}

async function asyncFetchPut(url, data) {
  let fullUrl = medicalLeaveServer + url;
  let options = {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: headers
  };

  let response = await asyncFetchCore(fullUrl, options);
  return response;
}

/*
 * Core functions
 */

async function login() {
  let username = document.getElementById('employee-id').value;
  let password = document.getElementById('password').value;

  let data = {
    id: username,
    password: password
  };

  try {
    let response = await asyncFetchPost('/login', data);

    if (response.success == 1) {
      document.cookie = `employee_id=${response.employee_id}; path=/`;
      console.log(document.cookie);
      window.location.href = "index.html";
    } else {
      alert("Wrong Username/Password!");
    }
  } catch(error) {
    handleError(error);
  }
}

function employeeId() {
  if (document.cookie) {
    let cookieArray = [];
    let targetIndex;
    let cookieString = decodeURIComponent(document.cookie);

    cookieString.split(';').forEach(function(pairs) {
      pairs.split('=').forEach(function(key) {
          cookieArray.push(key);
      });
    });

    cookieArray.forEach(function(key, index) {
      if (key == 'employee_id') {
        targetIndex = index+1;
      }
    });

    return cookieArray[targetIndex];
  } else {
    window.location.href = "login.html";
  }
}

function logoutSession() {
  document.cookie = `employee_id=; path=/`;
  window.location.href = "login.html";
}

async function updateSideBar() {
  console.log(document.cookie);
  let id = employeeId();

  if (id) {
    try {
      let response = await asyncFetchGet('/employee/role/' + employeeId());

      if (response.role == "supervisor") {
        showElement('s_teaminfo');
        showElement('s_pending');
        populateMainContent('s_pending');
      } else {
        hideElement('s_teaminfo');
        hideElement('s_pending');
        populateMainContent('s_inform');
      }
    } catch(error) {
      handleError(error);
    }
  } else {
    window.location.href = "login.html";
  }
}

function populateMainContent(option) {
  unSelectAllSidebarOptions();
  document.getElementById(option).classList.add('selected');

  switch (option) {
    case 's_inform':
      populateInform();
      break;
    case 's_update':
      populateUpdate(null);
      break;
    case 's_myinfo':
      populateMyInfo();
      break;
    case 's_clinics':
      populateClinics();
      break;
    case 's_teaminfo':
      populateEmployeeInfo(null);
      break;
    case 's_pending':
      populatePending();
      break;
    case 's_logout':
      logoutSession();
      break;
  }
}

/*
 * Inform Leave content populator
 */
function populateInform() {
  let pageTitle = "Inform Medical Leave";
  document.title = pageTitle;

  let todayObj = new Date();
  let today = dateObjectToString(todayObj);

  let htmlString = `<div class="page-title"><h4>${pageTitle}</h4><hr></div>
                      <form class="generic-form" action="#">
                        <div class="login-form">
                          <label for="remarks">Remarks</label>
                          <textarea name="Remarks" id="remarks"
                            rows="5" cols="50" maxlength="200"
                            wrap="hard"
                            required autofocus></textarea>
                        </div>
                        <div class="login-form">
                          <label for="date">Date</label>
                          <input type="date" name="Date" id="date" value="${today}" required>
                        </div>
                        <div class="login-form">
                          <label></label>
                          <input class="generic-button" type="button" onclick="informLeave()" value="Submit">
                        </div>
                      </form>`;

  updateMainContentBox(htmlString);
}

async function informLeave() {
  let remarks = document.getElementById("remarks").value;
  let fromDate = document.getElementById("date").value;

  let data = {
    remarks: remarks,
    from_date: fromDate,
    employee_id: employeeId()
  };

  try {
    let response = await asyncFetchPost('/medicalleave/inform', data);

    if (response.success == 1) {
      alert("Your supervisor has been informed of the leave request!");
      populateMyInfo();
    }
  } catch(error) {
    handleError(error);
  }
}

/*
 * My Info content populator
 */
async function populateMyInfo() {
  let pageTitle = "My Info";
  document.title = pageTitle;

  let htmlString = '';

  try {
    let response = await asyncFetchGet('/employee/leaves/' + employeeId());

    if (response.success == 1) {
      let pendingTableBody = '';
      let historyTableBody = '';

      response.leaves.forEach(function(leave, index) {
        let leaveStatus;
        let fromDate = dateStringToObject(leave.from_date).toDateString();

        if (leave.status) {
            if (leave.mc)  { // If leave is acknowledged and mc is uploaded, show under history
              let days = getNumberOfDays(leave.from_date, leave.to_date);

              historyTableBody += `<div class="divTableRow">
                                     <div class="divTableCell">${index+1}</div>
                                     <div class="divTableCell">${fromDate}</div>
                                     <div class="divTableCell">${leave.remarks}</div>
                                     <div class="divTableCell">${days}</div>
                                   </div>`;
            } else { // Leave approved MC Pending
              leaveStatus = 'MC Pending';
            }
        } else { // leave not acknowledged yet
          leaveStatus = 'Pending Acknowledgement';
        }

        if (leaveStatus) { // continue is not working inside the above if statement - so using this hack
          pendingTableBody += `<div class="divTableRow">
                                 <div class="divTableCell"><a href="#" onclick="populateUpdate(${leave.id})">${index+1}</a></div>
                                 <div class="divTableCell">${fromDate}</div>
                                 <div class="divTableCell">${leave.remarks}</div>
                                 <div class="divTableCell">${leaveStatus}</div>
                               </div>`;
        }
      });

      htmlString += createLeavesTable('Pending', pendingTableBody);
      htmlString += createLeavesTable('History', historyTableBody);

      updateMainContentBox(htmlString);
    }
  } catch(error) {
    handleError(error);
  }
}

/*
 * Clinics content populator
 */
async function populateClinics() {
  let pageTitle = "Clinics";
  document.title = pageTitle;

  let htmlString = '';

  try {
    let response = await asyncFetchGet('/clinics/all');

    if (response.success == 1) {
      let tableBody = '';

      response.clinics.forEach(function(clinic, index) {
        tableBody += `<div class="divTableRow">
                        <div class="divTableCell">${index+1}</div>
                        <div class="divTableCell">${clinic.name}</div>
                        <div class="divTableCell">${clinic.address}</div>
                        <div class="divTableCell">${clinic.contact_no}</div>
                      </div>`;
      });

      htmlString += createClinicsTable(tableBody);
      updateMainContentBox(htmlString);
    }
  } catch(error) {
    handleError(error);
  }
}

/*
 * Update leave populator
 */
async function populateUpdate(leaveId) {
  let pageTitle = "Update Leave";
  document.Title = pageTitle

  try {
    let htmlString = '';
    let clinicsHtml = '';

    // Fetch the list of clinics
    let clinicsResponse = await asyncFetchGet('/clinics/all');

    if (clinicsResponse.success == 1) {
      clinicsResponse.clinics.forEach(function(clinic) {
        clinicsHtml += `<option value="${clinic.id}">${clinic.name}</option>`;
      });
    }

    if (leaveId) {
    // Get the leave's available information
      let response = await asyncFetchGet('/medicalleave/'+leaveId);

      if (response.success == 1) {
        let fromDate = dateObjectToString(dateStringToObject(response.from_date));
        let remarks = response.remarks;
        htmlString = createUpdateLeaveForm(pageTitle, remarks, fromDate, clinicsHtml, leaveId);
      }
    } else {

      htmlString = createUpdateLeaveForm(pageTitle, '', '', clinicsHtml, leaveId);
    }
    updateMainContentBox(htmlString);
  } catch(error) {
    handleError(error);
  }
}

async function updateLeaveRequest(id) {
  let mcFile = document.getElementById('mc').files[0];
  let formData = new FormData();
  formData.append('MC', mcFile);

  try {
    let response = await asyncFetchPost('/upload/mc', formData);

    if (response.success == 1) {
      let data = {
        employee_id: employeeId(),
        remarks: document.getElementById('remarks').value,
        from_date: document.getElementById('f_date').value,
        to_date: document.getElementById('t_date').value + ' 23:59:59', // for the number of days calculation to work
        mc: `/uploads/${response.mc}`,
        clinic_id: document.getElementById('clinics').value
      };

      if (id) {
        //Update existing leave
        let response = await asyncFetchPut('/medicalleave/'+id, data);

        if (response.success == 1) {
          alert("Leave request updated!");
          populateMyInfo();
        }
      } else {
        // Create new leave request
        let response = await asyncFetchPost('/medicalleave/inform', data);

        if (response.success == 1) {
          alert("Your supervisor has been informed of the leave request!");
          populateMyInfo();
        }
      }
    }
  } catch(error) {
    handleError(error);
  }
}

/*
 * Pending page populator (for managers)
 */
async function populatePending() {
  let pageTitle = "Pending";
  document.title = pageTitle;

  try {
    let response = await asyncFetchGet('/supervisor/leaves/'+employeeId()+'?status=0');

    if (response.success == 1) {
      let leaveTableBody = '';

      response.leaves.forEach(function(leave, index) {
        leaveTableBody += `<div class="divTableRow">
                             <div class="divTableCell">${index + 1}</div>
                             <div class="divTableCell"><a href="#" onclick="populateEmployeeInfo(${leave.employee_id})">${leave.employee_id}</a></div>
                             <div class="divTableCell">${leave.first_name} ${leave.last_name}</div>
                             <div class="divTableCell"><a href="#" onclick="populateLeaveInfo(${leave.employee_id}, ${leave.leave_id})">View</a></div>
                             <div class="divTableCell"><a href="#" onclick="updateLeaveStatus(${leave.leave_id}, 1)">Acknowledge</a></div>
                           </div>`;
      });

      let htmlString = `<div class="page-title"><h4>${pageTitle}</h4><hr></div>
                        <div class="divTable blueTable">
                          <div class="divTableBody">
                            ${leaveTableBody}
                          </div>
                        </div>`;

      updateMainContentBox(htmlString);
    }
  } catch(error) {
    handleError(error);
  }
}

async function searchEmployee() {
  let fullNameArray = document.getElementById('search-box').value.split(' ');
  let firstName = fullNameArray[0];
  let lastName = fullNameArray[1];
  let id;

  try {

    //get the employeeID
    let url = `/employee?first_name=${firstName}`;

    if (lastName) {
      url += `&last_name=${lastName}`;
    }

    let response = await asyncFetchGet(url);

    if (response.success == 1) {
      if (response.employees.length !== 0) {
        id = response.employees[0].id;

        // Fetch the employees details
        response = await asyncFetchGet('/employee/'+id);

        if (response.success == 1) {
          if (response.supervisor == employeeId()) {
            populateEmployeeInfo(id);
          } else {
            alert("You can view your direct report's details only!")
          }
        }
      } else {
        alert("Employee not found!");
      }
    }
  } catch(error) {
    handleError(error);
  }
}

async function populateEmployeeInfo(id) {
  let pageTitle = "Team Info";
  document.title = pageTitle;

  let htmlString = `<div class="page-title"><h4>Employee Details</h4><hr></div>
                    <form class="generic-form" id="employee-search" action="#">
                      <div class="login-form">
                        <input type="search" id="search-box" placeholder="Employee Name" required>
                        <label for="search-box"><img src="./images/search.svg" style="padding-left: 5px" width="20px" onclick="searchEmployee()"></label>
                      </div>
                    </form>`;

  if (id) {
    try {
      // Get employee details
      let response = await asyncFetchGet('/employee/'+id);

      if (response.success == 1) {
        htmlString += `<form class="generic-form" action="#">
                         <div class="login-form">
                           <label for="emp-details"><img src="${medicalLeaveServer}${response.picture}"></label>
                           <div id="emp-details" class="page-text">${response.first_name} ${response.last_name}</br> ${response.id}</br> ${response.designation} </div>
                         </div>
                       </form><p></p>`;
      }

      // Get leave history
      let historyResponse = await asyncFetchGet('/employee/leaves/'+id+'?status=1');

      if (historyResponse.success = 1) {
        let historyTableBody = '';

        historyResponse.leaves.forEach(function(leave, index) {
          let fromDate = dateStringToObject(leave.from_date).toDateString();
          let days = getNumberOfDays(leave.from_date, leave.to_date);

          historyTableBody += `<div class="divTableRow">
                                 <div class="divTableCell">${index+1}</div>
                                 <div class="divTableCell">${fromDate}</div>
                                 <div class="divTableCell">${leave.remarks}</div>
                                 <div class="divTableCell">${days}</div>
                               </div>`;
        });

        htmlString += createLeavesTable('History', historyTableBody);
      }
    } catch(error) {
      handleError(error);
    }
  }

  updateMainContentBox(htmlString);
}

async function populateLeaveInfo(id, leaveId) {
  let pageTitle = "Team Info";
  document.title = pageTitle;

  let htmlString = `<div class="page-title"><h4>${pageTitle}</h4><hr></div>`;

  try {
    // Get employee details
    let response = await asyncFetchGet('/employee/'+id);

    if (response.success == 1) {
      htmlString += `<form class="generic-form" action="#">
                       <div class="login-form">
                         <label for="emp-details"><img src="${medicalLeaveServer}${response.picture}"></label>
                         <div id="emp-details" class="page-text">${response.first_name} ${response.last_name}</br>${response.id}</br>${response.designation}</div>
                       </div>
                     </form>`;
    }

    // Get leave details
    response = await asyncFetchGet('/medicalleave/' + leaveId);

    if (response.success == 1) {
      let status = leaveStatus[response.status];
      let fromDate = dateStringToObject(response.from_date).toDateString();
      let days = getNumberOfDays(response.from_date, response.to_date);

      htmlString += `<form class="generic-form" action="#">
                       <div class="login-form">
                         <label for="remarks">Remarks</label>
                         <div id="remarks">${response.remarks}</div>
                       </div>
                       <div class="login-form">
                         <label for="f_date">From</label>
                         <div id="f_date">${fromDate}</div>
                       </div>
                       <div class="login-form">
                         <label for="days">Days</label>
                         <div id="days">${days}</div>
                       </div>
                       <div class="login-form">
                         <label for="mc">MC</label>
                         <div id="mc">${status}</div>
                       </div>
                       <input class="generic-button" type="button" onclick="updateLeaveStatus(${leaveId}, 1)" value="Acknowledge">
                     </form>`;
    }

    // Get task list
    response = await asyncFetchGet('/employee/tasks/' + id);

    if (response.success == 1) {
      let tableHeading = `<div class="divTableHead smallColumn">No</div>
                          <div class="divTableHead mediumColumn">Title</div>
                          <div class="divTableHead largeColumn">Description</div>
                          <div class="divTableHead mediumColumn">Deadline</div>`;

      let tableBody = '';

      response.tasks.forEach(function(task, index) {
        let deadLine = dateStringToObject(task.deadline).toDateString();

        tableBody += `<div class="divTableRow">
                        <div class="divTableCell">${index+1}</div>
                        <div class="divTableCell">${task.name}</div>
                        <div class="divTableCell">${task.details}</div>
                        <div class="divTableCell">${deadLine}</div>
                      </div>`;
      });

      htmlString += createTable('Tasks', tableHeading, tableBody);
    }

    updateMainContentBox(htmlString);
  } catch(error) {
    handleError(error);
  }
}

/*
 * Update leave status
 */
async function updateLeaveStatus(leaveId, status) {
  let data = {
    status: `${status}`
  };

  try {
    let response = await asyncFetchPut('/medicalleave/' + leaveId, data);

    if (response.success == 1) {
      alert("Leave status updated!");
      populatePending();
    }
  } catch(error) {
    handleError(error);
  }
}
