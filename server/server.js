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
const cors = require('cors');

const dotEnvOptions = {
    path: __dirname + '../../.env'
}

require('dotenv').config(dotEnvOptions);

// Form Data, Multer, & Uploads
const FormData = require('form-data');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Main App
const app = express();

// Configuration
const features = require('../key.js');

var integration = features.integration;
var host = features.host;
var endpoint = features.endpoint;
var url = host + endpoint;
var port = features.port || 3200;

app.use(cors());
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Get index.html page from server
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/static/test.html');
});

// Get features from key file - try to not make it async funciton
app.get('/features', async function (req, res) {
    res.json(features);
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
            headers: headers
        });
    }

    const workflow_list = await getWorkflows();
    const data = await workflow_list.json();

    res.json(data['userWorkflowList']);
});

// GET /workflows/{workflowId}
app.get('/api/getWorkflowById/:id', async function (req, res, next) {

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
            headers: headers
        })
    }

    const workflow_by_id = await getWorkflowById();
    const data = await workflow_by_id.json();

    res.json(data);
});

// POST /workflows/{workflowId}/agreements
app.post('/api/postAgreement/:id', async function (req, res, next) {

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
            method: 'POST',
            headers: headers,
            body: JSON.stringify(req.body)
        })
    }

    const api_response = await postAgreement();
    const data = await api_response.json();

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
