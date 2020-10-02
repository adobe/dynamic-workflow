/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

// Express, Async, Fetch, & Body Parser
const express = require('express');
const fetch = require('node-fetch');
const sleep = require('await-sleep');
require('dotenv').config()

const bodyParser = require('body-parser');

// Form Data, Multer, & Uploads
const FormData = require('form-data');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// HTTPS & Path
const path = require('path');

// js-yaml
const yaml = require('js-yaml');
const config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'config', 'config.yaml'), 'utf-8'));

// Main App
const app = express();

// Configuration
var host = config.server.host.replace(/\/$/, '');
var endpoint = config.server.endpoint;
var url = host + endpoint;
var port = process.env.PORT || config.port || 80;

var integration_key = null;
if ('enterprise' in config && config.enterprise && 'integration' in config.enterprise && config.enterprise.integration) {
  integration_key = config.enterprise.integration;
} else {
  integration_key = process.env.INTEGRATION_KEY;
}

var headers = {
  'Access-Token': integration_key,
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};
if (config['features']['x-api-user']) {
  headers['x-api-user'] = config['features']['x-api-user'];
}

let emailRegex = config['features']['email_regex'];
let emailErrorMessage = config['features']['email_error_message'];

app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Get features from config files
app.get('/features', function (req, res) {
  res.json(config['features']);
});

// GET /workflows
app.get('/api/getWorkflows', async function (req, res) {

  function getWorkflows() {
    /***
     * This function makes a request to get workflows
     */
    const endpoint = '/workflows';

    return fetch(url + endpoint, {
      method: 'GET',
      headers: headers
    });
  }

  const workflow_list = await getWorkflows();
  const data = await workflow_list.json();

  res.json(data['userWorkflowList']);
});

// GET /workflows/{workflowId}
app.get('/api/getWorkflowById/:id', async function (req, res) {

  function getWorkflowById() {
    /***
     * This function makes a request to get workflow by ID
     */
    const endpoint = '/workflows/' + req.params.id;

    return fetch(url + endpoint, {
      method: 'GET',
      headers: headers
    });
  }

  const workflow_by_id = await getWorkflowById();
  const data = await workflow_by_id.json();

  res.json(data);
});

// POST /workflows/{workflowId}/agreements
app.post('/api/postAgreement/:id', async function (req, res) {

  function postAgreement() {
    /***
     * This function post agreements
     */
    const endpoint = '/workflows/' + req.params.id + '/agreements';

    return fetch(url + endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(req.body)
    });
  }


  let okToSubmit = true;

  for (let o = 0; req.body.documentCreationInfo.recipientsListInfo.length > o; o++) {
    console.log(req.body.documentCreationInfo.recipientsListInfo[o].recipients);
    for (let i = 0; req.body.documentCreationInfo.recipientsListInfo[o].recipients.length > i; i++) {
      if (!req.body.documentCreationInfo.recipientsListInfo[o].recipients[i].email.match(emailRegex)) {
        okToSubmit = false;
      }
    }
  }

  let data;

  if (okToSubmit) {
    const api_response = await postAgreement();
    data = await api_response.json();
  } else {
    data = { code: 'MISC_ERROR', message: emailErrorMessage };
  }

  res.json(data);
});


// GET /agreements/{agreementId}/signingUrls

app.get('/api/getSigningUrls/:id', async function (req, res) {

  async function getSigningUrls(count = 0) {
    /***
     * This function gets URL for the e-sign page for the current signer(s) of an agreement.
     */
    const endpoint = '/agreements/' + req.params.id + '/signingUrls';

    const sign_in_response = await fetch(url + endpoint, {
      method: 'GET',
      headers: headers
    });

    const sign_in_data = await sign_in_response.json();

    // Look for times to retry and default to 15, if not found
    const retries = 'sign_now_retries' in config['features'] ? config['features']['sign_now_retries'] : 60;

    if (sign_in_data.code === 'AGREEMENT_NOT_SIGNABLE' || sign_in_data.code === 'BAD_REQUEST') {
      // retry for n times with 1s delay
      if (count >= retries) {
        return sign_in_data;
      } else {
        await sleep(1000);
        count++;
        return await getSigningUrls(count);
      }
    }
    return sign_in_data;
  }

  const data = await getSigningUrls();

  res.json(data);
});

// POST /transientDocuments
app.post('/api/postTransient', upload.single('myfile'), async function (req, res) {

  function postTransient() {
    /***
     * This functions post transient
     */
    const endpoint = '/transientDocuments';
    let newHeader = { ...headers };
    delete newHeader['Accept'];
    delete newHeader['Content-Type'];

    return fetch(url + endpoint, {
      method: 'POST',
      headers: newHeader,
      body: form
    });
  }

  // Create FormData
  var form = new FormData();
  form.append('File-Name', req.file.originalname);
  form.append('Mime-Type', req.file.mimetype);
  form.append('File', fs.createReadStream(req.file.path));

  const api_response = await postTransient();
  const data = await api_response.json();


  // Delete uploaded doc after transient call
  fs.unlink(req.file.path, function (err) {
    if (err) return console.log(err);
  });

  res.json(data);
});


app.listen(port, () => console.log(`Server started on port ${port}`));
