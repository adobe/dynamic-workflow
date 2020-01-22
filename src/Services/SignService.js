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

// Service for commmunicating with Sign API and server
class SignService {
    constructor() {
        this.baseUrl = "http://localhost:3200";
    }

    // Gets a list of workflows
    getWorkflows = async () => {
        const url = this.baseUrl + "/api/getWorkflows";
        const resp = await fetch(url);
        const body = await resp.json();
        return body;
    }

    // Gets workflow detail
    getWorkflowById = async (workflowId) => {
        if (workflowId) {
            const url = this.baseUrl + `/api/getWorkflowById/${workflowId}`;
            const resp = await fetch(url);
            const body = await resp.json();
            return body;
        }
        return null;
    }

    // Posts an agreement for a workflow
    postWorkflowAgreement = async (workflowId, body) => {
        const url = this.baseUrl + `/api/postAgreement/${workflowId}`;
        const resp = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        return await resp.json();
    }

    // Post transient to server
    postTransient = async (file) => {
        const url = this.baseUrl + `/api/postTransient`;

        const formData = new FormData();
        formData.append('myfile', file);

        const resp = await fetch(url, {
            method: 'POST',
            body: formData
        });

        return await resp.json();
    }
}

export default SignService;
