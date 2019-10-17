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

// Main App
const app = express();

// HTTPS & Path
const https = require('https');
const path = require('path');
const httpsOptions = {
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt')),
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key'))
}


// Configuration
const integration = "3AAABLblqZhAWRW-rUIElksOJuQaRr-ycSIBFpc9Pyh1HQS4TvpOmji_CfEMm3O_CdBUoIlYdA4W45cyjpa3LuGSuz54LzMGw";
const host = "https://api.na2.echosign.com:443";
const endpoint = "/api/rest/v5";
const url = host + endpoint;

app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/static/test.html');
});

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
app.post('/api/postAgreement/:id', async function(req, res, next){

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

const port = 5000;

// app.listen(port, () => console.log(`Server started on port ${port}`));

https.createServer(httpsOptions, app)
    .listen(port, function () {
        console.log(`Server started on port ${port}`)
    })