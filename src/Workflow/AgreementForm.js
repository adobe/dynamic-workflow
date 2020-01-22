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

import SignService from '../Services/SignService';
import WorkflowService from '../Services/WorkflowService';
import ConfigService from '../Services/ConfigService';

import RecipientsList from './RecipientsList';
import CarbonCopy from './CarbonCopy';
import FileList from './FileList';
import MergeField from './MergeField';
import Deadline from './Deadline';
import Reminder from './Reminder';
import PassOption from './PassOption';

class AgreementForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            workflow: null,
            signService: new SignService(),
            configService: new ConfigService(),
            workflowService: new WorkflowService(),

            workflowName: props.workflowName,
            isPasswordValid: true,
            features: null,

            // Agreement data
            workflowId: props.workflowId,
            transientId: props.transientDocumentId,
            agreementName: "",
            fileInfos: [],
            recipientsList: [],
            recipientGroup: [],
            carbonCopyGroup: [],
            mergeFieldGroup: [],
            passOption: "",
            deadline: "",
            reminders: "",
            message: ""
        };
    }

    // Set data to parent state
    setParentState = (state) => {
        this.setState(state);
    }

    // Get parent state
    getParentState = () => {
        return this.state;
    }

    async componentDidMount() {
        const workflow = await this.state.signService.getWorkflowById(this.state.workflowId);
        this.setWorkflow(workflow);
        const features = await this.state.configService.getFeatures();
        this.setState({
            features: features
        })
    }

    // Sets workflow data
    setWorkflow(workflow) {
        if (workflow) {
            const agreementName = workflow.agreementNameInfo ? workflow.agreementNameInfo.defaultValue : '';
            const message = workflow.messageInfo ? workflow.messageInfo.defaultValue : '';
            this.setState({
                workflow: workflow,
                agreementName: agreementName,
                message: message,
                fileInfos: workflow.fileInfos ? workflow.fileInfos : [],
                recipientsList: workflow.recipientsListInfo ? workflow.recipientsListInfo : [],
                carbonCopyGroup: [],
                mergeFieldGroup: workflow.mergeFieldsInfo ? workflow.mergeFieldsInfo : []
            });
        }
        else {
            if (workflow !== this.state.workflow) {
                this.setState({
                    workflow: workflow
                });
            }
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.workflowId !== this.state.workflowId) {
            const workflow = await this.state.signService.getWorkflowById(this.state.workflowId);
            this.setWorkflow(workflow);
        }
    }

    // Refresh after selecting another workflow
    static getDerivedStateFromProps(props, state) {
        if (state.workflowId !== props.workflowId) {
            return {
                workflowId: props.workflowId
            };
        }
        return null;
    }

    // Event handler when an input text changed
    onTextChanged = (event) => {
        const name = event.target.name;
        const val = event.target.value;

        this.setState({ [name]: val });
    }

    // onClick event handler for submitting data
    onSubmit = async () => {
        const agreementData = this.state.workflowService.createAgreementData(this.state);
        // console.log('Agreement data to be submitted: ');
        // console.log(agreementData);

        // Submit agreement to API server
        const response = await this.state.signService.postWorkflowAgreement(
            this.state.workflowId, agreementData);

        if ('url' in response) {
            alert('Agreement sent');
        }
        else {
            alert(response.message);
        }
    }

    render() {
        // Cannot submit if password is invalid
        const isSubmitEnabled = this.state.isPasswordValid;
        if (!this.state.workflow) {
            return (<div></div>);
        }
        return (
            <div id="dynamic_form">
                <div className="row">
                    <div className="col-lg-12">
                        <form id="recipient_form" encType="multipart/form-data">
                            <div className="col-lg-12" id="bottom_form_top">
                                <div>
                                    <h3>{this.state.workflow.description}</h3>
                                </div>
                                <RecipientsList setParentState={this.setParentState} getParentState={this.getParentState}
                                    workflowId={this.state.workflow.name} features={this.state.features} workflowName={this.state.workflow.displayName}
                                    recipientsListInfo={this.state.workflow.recipientsListInfo} workflow={this.state.workflow} />
                                <CarbonCopy setParentState={this.setParentState} getParentState={this.getParentState}
                                    workflowId={this.state.workflow.name} features={this.state.features} workflowName={this.state.workflow.displayName}
                                    ccsListInfo={this.state.workflow.ccsListInfo} />
                            </div>
                            <div className="col-lg-12" id="bottom_form_bottom">
                                <div className="row">
                                    <div className="col-lg-7">
                                        <div>
                                            <h3 className="recipient_label">Document Name</h3>
                                            <input type="text" id="agreement_name" name="agreementName"
                                                placeholder="Enter Agreement Name" className="recipient_form_input"
                                                required
                                                value={this.state.agreementName}
                                                onChange={this.onTextChanged}>
                                            </input>
                                        </div>
                                        <div>
                                            <h3 className="recipient_label">Messages</h3>
                                            <textarea id="messages_input" name="message" rows="3"
                                                placeholder="Message" className="recipient_form_input"
                                                value={this.state.message}
                                                onChange={this.onTextChanged}>
                                            </textarea>
                                        </div>
                                        <FileList setParentState={this.setParentState} getParentState={this.getParentState}
                                            workflowId={this.state.workflow.name} fileInfos={this.state.workflow.fileInfos} />
                                        <MergeField setParentState={this.setParentState} getParentState={this.getParentState}
                                            workflowId={this.state.workflow.name} />
                                    </div>
                                    <div className="col-lg-5">
                                        <div className="option_wrapper">
                                            <div id="options" className="col-lg-12">
                                                <PassOption setParentState={this.setParentState} getParentState={this.getParentState}
                                                    workflowId={this.state.workflow.name}
                                                    passwordVisible={this.state.workflow.passwordInfo.visible} />
                                                <Deadline setParentState={this.setParentState} getParentState={this.getParentState} 
                                                    workflowId={this.state.workflow.name} 
                                                    deadlineVisible={this.state.workflow.expirationInfo ? this.state.workflow.expirationInfo.visible : ''} />
                                                <Reminder setParentState={this.setParentState} getParentState={this.getParentState} 
                                                    workflowId={this.state.workflow.name} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12" id="form_submit">
                                <button type="button" className="btn btn-primary btn-custom"
                                    id="recipient_submit_button" onClick={this.onSubmit}
                                    disabled={!isSubmitEnabled}>
                                    Submit
                            </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default AgreementForm;