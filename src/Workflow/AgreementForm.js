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
      allMaxSubmits: 0,
      maxSubmits: 0,

      queryData: props.queryData,

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
    let workflow = await this.state.signService.getWorkflowById(this.state.workflowId);
    this.setWorkflow(workflow);
    this.setState({
      features: await this.state.configService.getFeatures()
    })
  }

  // Sets workflow data
  setWorkflow(workflow) {
    if (workflow) {
      let agreementName = this.state.queryData.agreementName ? this.state.queryData.agreementName :
        workflow.agreementNameInfo ? workflow.agreementNameInfo.defaultValue : '';
      let message = this.state.queryData.message ? this.state.queryData.message :
        workflow.messageInfo ? workflow.messageInfo.defaultValue : '';
      this.setState({
        workflow: workflow,
        agreementName: agreementName,
        message: message,
        fileInfos: workflow.fileInfos ? workflow.fileInfos : [],
        recipientsList: workflow.recipientsListInfo ? workflow.recipientsListInfo : [],
        carbonCopyGroup: [],
        mergeFieldGroup: workflow.mergeFieldsInfo ? workflow.mergeFieldsInfo : [],
        maxSubmits: 0
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
      let workflow = await this.state.signService.getWorkflowById(this.state.workflowId);
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
    let name = event.target.name;
    let val = event.target.value;

    this.setState({ [name]: val });
  }

  // onClick event handler for submitting data
  onSubmit = async () => {
    let agreementData = this.state.workflowService.createAgreementData(this.state);
    console.log('Agreement data to be submitted: ');
    console.log(agreementData);

    // Increments submit counter
    this.setState({
      maxSubmits: ++this.state.maxSubmits,
      allMaxSubmits: ++this.state.allMaxSubmits
    })

    // Submit agreement to API server
    let response = await this.state.signService.postWorkflowAgreement(
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
    let isSubmitEnabled = this.state.isPasswordValid;
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
                  recipientsListInfo={this.state.workflow.recipientsListInfo} workflow={this.state.workflow}
                  recipientEmails={this.state.queryData.recipientEmails} />
                <CarbonCopy setParentState={this.setParentState} getParentState={this.getParentState}
                  workflowId={this.state.workflow.name} features={this.state.features} workflowName={this.state.workflow.displayName}
                  ccsListInfo={this.state.workflow.ccsListInfo} ccEmails={this.state.queryData.ccEmails} />
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
                      workflowId={this.state.workflow.name} mergeFieldsInfo={this.state.workflow.mergeFieldsInfo}
                      fieldFill={this.state.queryData.fieldFill} />
                  </div>
                  <div className="col-lg-5">
                    <div className="option_wrapper">
                      <div id="options" className="col-lg-12">
                        <PassOption setParentState={this.setParentState} getParentState={this.getParentState}
                          workflowId={this.state.workflow.name}
                          passwordVisible={this.state.workflow.passwordInfo.visible} />
                        <Deadline setParentState={this.setParentState} getParentState={this.getParentState}
                          workflowId={this.state.workflow.name} deadlineFill={this.state.queryData.deadlineFill}
                          deadlineVisible={this.state.workflow.expirationInfo ? this.state.workflow.expirationInfo.visible : ''} />
                        <Reminder setParentState={this.setParentState} getParentState={this.getParentState}
                          workflowId={this.state.workflow.name} reminders={this.state.reminders}
                          reminderFill={this.state.queryData.reminderFill} />
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
