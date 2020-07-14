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

const bodyParser = require('body-parser');

// Form Data, Multer, & Uploads
const FormData = require('form-data');
const fs = require('fs');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

// HTTPS & Path
const path = require('path');

// js-yaml
const yaml = require('js-yaml');
const config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'config', 'config.yaml'), 'utf-8'));

// Main App
const app = express();

// Configuration
var host = config['server']['host'];
var endpoint = config['server']['endpoint'];
var url = host + endpoint;
var port = process.env.PORT || config.port || 80;

var headers = {
  'Access-Token': config['enterprise']['integration'],
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};
if (config['features']['x-api-user']) {
  headers['x-api-user'] = config['features']['x-api-user'];
}


app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Get index.html page from server
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/static/test.html');
});

// Get features from config files
app.get('/features', function (req, res){
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
      headers: headers});
  }

  const workflow_list = await getWorkflows();
  const data = await workflow_list.json();

  res.json(data['userWorkflowList']);
});

// GET /workflows/{workflowId}
app.get('/api/getWorkflowById/:id', async function(req, res){

  function getWorkflowById() {
    /***
         * This function makes a request to get workflow by ID
         */
    const endpoint = '/workflows/' + req.params.id;

    return fetch(url + endpoint, {
      method: 'GET',
      headers: headers});
  }

  const workflow_by_id = await getWorkflowById();
  const data = await workflow_by_id.json();

  res.json(data);
});

// POST /workflows/{workflowId}/agreements
app.post('/api/postAgreement/:id', async function(req, res){

  function postAgreement() {
    /***
         * This function post agreements
         */
    const endpoint = '/workflows/' + req.params.id + '/agreements';

    return fetch(url + endpoint, {
      method:'POST',
      headers: headers,
      body: JSON.stringify(req.body)});
  }

  const api_response = await postAgreement();
  const data = await api_response.json();

  res.json(data);
});


// GET /agreements/{agreementId}/signingUrls
app.get('/api/getSigningUrls/:id', async function(req, res){

  async function getSigningUrls(count=0) {
    /***
     * This function gets URL for the e-sign page for the current signer(s) of an agreement.
     */
    const endpoint = '/agreements/' + req.params.id + '/signingUrls';

    const sign_in_response = await fetch(url + endpoint, {
      method:'GET',
      headers: headers});

    const sign_in_data =  await sign_in_response.json();
    if(sign_in_data.code === 'AGREEMENT_NOT_SIGNABLE'){
      //retry for 5 times with 1000ms delay
      if(count >= 5){
        return sign_in_data;
      }else{
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

    return fetch(url + endpoint, {
      method: 'POST',
      headers: headers,
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
