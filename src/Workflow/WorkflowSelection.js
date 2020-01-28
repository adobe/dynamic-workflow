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

import React, { Component } from 'react';
import AgreementForm from './AgreementForm';
import SignService from '../Services/SignService';
import WorkflowService from '../Services/WorkflowService';
import queryString from 'query-string';

class WorkflowSelection extends Component {
    constructor(props) {
        super(props);

        let workflowName = null;
        if (props.match && props.match.params) {
            workflowName = props.match.params.name;
        }

        const locationSearch = queryString.parse(this.props.location.search);
        const queryData = locationSearch ? locationSearch : null;

        this.state = {
            hideSelector: props.hideSelector,
            workflows: [],
            workflowName: workflowName,
            workflowId: null,
            signService: new SignService(),
            workflowService: new WorkflowService(),
            queryData : {
                agreementName: queryData.agreementName,
                message: queryData.message,
                recipientEmails: queryData.recipient,
                ccEmails: queryData.cc,
                fieldFill: queryData.field,
                deadlineFill: queryData.deadline,
                reminderFill: queryData.reminder
            }
        };
    }

    async componentDidMount() {
        const workflows = await this.state.signService.getWorkflows();
        const workflowId = this.state.workflowService.getWorkflowId(workflows, this.state.workflowName);

        if (workflows) {
            this.setState({
                workflows: workflows,
                workflowId: workflowId
            });

        }
    }

    // Sets workflowId to show correct workflow data
    onWorkflowChanged = (event) => {
        const workflowId = event.target.value;
        this.setState({
            selectedWorkflowId: workflowId
        })
    }

    runWorkflow = () => {
        this.setState({
            workflowId: this.state.selectedWorkflowId
        })
    }

    render() {
        return (
            <div className="container h-100">
                <div className="row h-100 justify-content-center align-items-center">
                    <div id="workflow_form">
                        { !this.state.hideSelector &&
                            <div id="workflow_form_top">
                                <div id="workflow_form_top_wrapper">
                                    <div id="workflow_selector">
                                        <form>
                                            <div className="form-group">
                                                <label htmlFor="workflow_dropdown" id="workflow_dropdown_label">Workflow Selector</label>
                                                <select className="form-control" id="workflow_dropdown"
                                                    value={this.state.workflowName} 
                                                    onChange={this.onWorkflowChanged}
                                                    >
                                                    <option value=""></option>
                                                    {
                                                        this.state.workflows ? this.state.workflows.map(
                                                            workflow =>
                                                                <option key={workflow.name} value={workflow.workflowId}>
                                                                    {workflow.displayName}
                                                                </option>
                                                        ) : null
                                                    }
                                                </select>
                                            </div>
                                            <button type="button" className="btn btn-primary btn-custom" id="option_submit_button"
                                                onClick={this.runWorkflow}>Select
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        }
                        <div id="workflow_form_bottom">
                            <div id="workflow_form_bot_wrapper">
                                <AgreementForm workflowId={this.state.workflowId} queryData={this.state.queryData}></AgreementForm>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default WorkflowSelection;