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
const async = require('express-async-await');
const fetch = require('node-fetch');
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
var integration = config['enterprise']['integration'];
var host = config['server']['host'];
var endpoint = config['server']['endpoint'];
var url = host + endpoint;
var port = process.env.PORT || config.port || 80;

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
    res.json(config['features'])
})

// GET /workflows
app.get('/api/getWorkflows', async function (req, res, next) {

    function getWorkflows() {
        /***
         * This function makes a request to get workflows
         */
        const endpoint = '/workflows';
        const headers = {
            'Access-Token': integration
        };

        return fetch(url + endpoint, {
            method: 'GET',
            headers: headers});
    }

    const workflow_list = await getWorkflows();
    const data = await workflow_list.json();

    res.json(data['userWorkflowList']);
});

// GET /workflows/{workflowId}
app.get('/api/getWorkflowById/:id', async function(req, res, next){

    function getWorkflowById() {
        /***
         * This function makes a request to get workflow by ID
         */
        const endpoint = "/workflows/" + req.params.id;
        const headers = {
            'Access-Token': integration
        };

        return fetch(url + endpoint, {
            method: 'GET',
            headers: headers})
    }

    const workflow_by_id = await getWorkflowById();
    const data = await workflow_by_id.json();

    res.json(data);
});

// GET /libraryDocuments/{libraryDocumentId}/documents
app.get('/api/getLibraryDocuments/:id', async function(req, res, next) {

    function getLibraryDocuments() {
        /***
         * This function gets library documents by ID
         */
        const endpoint = "/libraryDocuments/" + req.params.id + "/documents";
        const headers = {
            'Access-Token': integration
        };

        return fetch(url + endpoint, {method: 'GET', headers: headers})
    }

    const library_document = await getLibraryDocuments();
    const data = await library_document.json();

    es.json(data);
});

// POST /workflows/{workflowId}/agreements
app.post('/api/postAgreement/:id', async function(req, res){

    function postAgreement() {
        /***
         * This function post agreements
         */
        const endpoint = "/workflows/" + req.params.id + "/agreements";
        const headers = {
            'Access-Token': integration,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        };

        return fetch(url + endpoint, {
            method:'POST',
            headers: headers,
            body: JSON.stringify(req.body)})
    }

    // console.log('request body', req.body);
    // console.log('body in JSON', JSON.stringify(req.body));

    console.log('first', req.body.documentCreationInfo.recipientsListInfo);
  console.log('second', req.body.documentCreationInfo.recipientsListInfo[0].recipients);

  console.log(req.body.documentCreationInfo.recipientsListInfo.length);

  let o = 0;

  console.log(req.body.documentCreationInfo.recipientsListInfo.length > o);

  let okToSubmit = true;

  for (let o = 0; req.body.documentCreationInfo.recipientsListInfo.length > o; o++) {
    console.log(req.body.documentCreationInfo.recipientsListInfo[o].recipients);
    for (let i = 0; req.body.documentCreationInfo.recipientsListInfo[o].recipients.length > i; i++) {
      console.log('hey we at least made it this far brah!');
      if (!req.body.documentCreationInfo.recipientsListInfo[o].recipients[i].email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        console.log('found bad email');
        okToSubmit = false;
      }
    }
  }
  let data;
   if (okToSubmit) {
     const api_response = await postAgreement();
     data = await api_response.json();
   } else {
     data = {code: 'MISC_ERROR', message: 'One or more emails are not formatted properly'};
   }

   console.log('return data', data);
    res.json(data);
});

// POST /transientDocuments
app.post('/api/postTransient', upload.single('myfile'), async function (req, res, next) {

    function postTransient() {
        /***
         * This functions post transient
         */
        const endpoint = "/transientDocuments";
        const headers = {
            'Access-Token': integration
        };

        return fetch(url + endpoint, {
            method: 'POST',
            headers: headers,
            body: form
        })
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


    res.json(data)
  })

app.listen(port, () => console.log(`Server started on port ${port}`));
