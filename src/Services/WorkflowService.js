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

class WorkflowService {

  // Gets workflow Id for a workflow name.
  getWorkflowId(workflows, workflowName) {
    let workflow = workflows.find(w => w.displayName === workflowName);
    return workflow ? workflow.workflowId : null;
  }

  createAgreementData(source) {
    let agreement = {
      "documentCreationInfo": {
        "fileInfos": source.fileInfos,
        "name": source.agreementName,
        "recipientsListInfo": source.recipientsList,
        "ccs": source.carbonCopyGroup,
        "securityOptions": source.passOption,
        "mergeFieldInfo": source.mergeFieldGroup,
        "reminderFrequency": source.reminders,
        "message": source.message
      }
    };

    if (source.deadline !== "") {
      agreement.documentCreationInfo.expirationInfo = source.deadline;
    }

    return agreement;
  }
}

export default WorkflowService;
