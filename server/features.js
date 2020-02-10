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

// Holds environment variables from .env file
module.exports = {
    integration: process.env.REACT_APP_SIGN_API_INTEGRATION,
    host: process.env.REACT_APP_SIGN_API_HOST,
    endpoint: process.env.REACT_APP_SIGN_API_ENDPOINT,
    port: process.env.REACT_APP_PORT,
    allMaxSubmits: process.env.REACT_APP_ALL_MAX_SUBMITS,
    maxSubmits: process.env.REACT_APP_MAX_SUBMITS,
    timeoutPeriod: process.env.REACT_APP_TIMEOUT_PERIOD,
    hideSelector: (process.env.REACT_APP_HIDE_SELECTOR === 'true'),
    hideRecipient: (process.env.REACT_APP_HIDE_PREDEFINED_RECIPIENT === 'true'),
    hideWorkflowList: process.env.REACT_APP_HIDE_PREDEFINED_RECIPIENT_WORKFLOW_LIST,
    hideCC: (process.env.REACT_APP_HIDE_PREDEFINED_CC === 'true'),
    hideCCWorkflowList: process.env.REACT_APP_HIDE_PREDEFINED_CC_WORKFLOW_LIST
}
