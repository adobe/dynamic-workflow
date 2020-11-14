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

class Workflow {

  constructor(workflow_id) {
    this.workflow_id = workflow_id;
    this.agreement_name = "";
    this.file_infos = [];
    this.recipients_list = [];
    this.recipient_group = [];
    this.carbon_copy_group = [];
    this.merge_field_group = [];
    this.pass_option = "";
    this.deadline = "";
    this.reminders = "";
    this.message = "";
  }

  setAgreementName(agreement_name) {
    /***
     * This function set the agreement name
     * @param {String} agreement_name name of the agreement
     */

    this.agreement_name = agreement_name;
  }

  updateAgreementName() {
    /***
     * This function will update the agreement name
     */

    var agreement_name = document.getElementById('agreement_name');
    this.setAgreementName(agreement_name.value);
  }

  updateRecipientGroup(recipient_group_data, recipient_groups) {
    /***
     * This function updates the recipeint groups
     * @param {Object} recipient_group_data The object of the whole recipient group
     * @param {Object} recipient_group The current group of the recipients being added
     */

    // Go through API recipients
    for (const i in recipient_group_data) {
      const required = Boolean(recipient_group_data[i]['minListCount'])
      const email = recipient_groups[i].email;
      const defaultValue = recipient_group_data[i]['defaultValue'];
      const many = recipient_group_data[i]['maxListCount'] !== 1;

      let groups = [];

      if (defaultValue === "") {
        if (many) {
          let groupChildren = recipient_groups[i]['target_div'].querySelectorAll('input');
          for (const child of groupChildren) {
            groups.push({ 'email': child.value });
          }
        } else {
          if (email) {
            groups.push({ 'email': email });
          } else if (required) {
            console.error("Missing a required email");
            alert("Missing a required email.");
            window.location.reload();
          }
          // groups.push({ 'email': document.getElementById("recipient_" + i).value });
        }
      } else {
        if (recipient_group_data[i]['editable']) {
          groups.push({ 'email': email });
        }
        else {
          groups.push({ 'email': defaultValue });
        }
      }
      if (groups.length && groups[0]['email']) {
        this.recipients_list.push({
          'name': recipient_group_data[i]['name'],
          'recipients': groups
        })
      }
    }
  }

  updateCcGroup(cc_group_data, cc_group) {
    /***
     * This function will update the carbon_copy_group list
     * @param {String} cc_group_data Cc recipients from API default value
     * @param {Object} cc_group Object of cc divs from web form
     */

    const editable = cc_group_data['editable'];
    const cc_list = cc_group_data['defaultValue'].split(",");
    var add_to_cc_list = [];

    for (let counter = 0; counter < cc_group.length; counter++) {
      if (!(editable)) {
        if (counter < cc_list.length) {
          add_to_cc_list.push(cc_list[counter]);
        }
      }
      else {
        add_to_cc_list.push(cc_group[counter].email);
      }
    }

    this.carbon_copy_group.push([
      {
        "name": cc_group_data['name'],
        "emails": add_to_cc_list
      }
    ]);
  }

  updateFileInfos(file_infos) {
    /***
     * This function updates the file infos
     * @param {Object} file_infos The file info object that holds file info
     */

    for (let i = 0; i < file_infos.length; i++) {
      if (file_infos[i]['workflow_lib_doc_id'] !== null) {
        this.file_infos.push(
          {
            "name": file_infos[i]['file_name'],
            "workflowLibraryDocumentId": file_infos[i]['workflow_lib_doc_id'][0]['workflowLibDoc']
          }
        )
      } else if (file_infos[i]['transient_id'] !== null) {
        this.file_infos.push(
          {
            "name": file_infos[i]['file_name'],
            "transientDocumentId": file_infos[i].transient_id
          }
        )
      }
    }
  }

  updateMergeFieldInfos(merge_fields) {
    /***
     * This function allows merging of user input
     * @param {String} merge_fields Fields for user input to be merged
     */

    for (let counter = 0; counter < merge_fields.length; counter++) {
      let merge_data = {
        'defaultValue': merge_fields[counter].default_value,
        'fieldName': merge_fields[counter].field_name
      };
      this.merge_field_group.push(merge_data)
    }
  }

  updateDeadline(today) {
    /***
     * This function will update the deadline.
     * @param {Date} today The date object for today
     */

    const date_input = document.getElementById('deadline_input').value;

    const today_date = new Date(today);
    const selected_date = new Date(date_input);

    const diffTime = Math.abs(selected_date - today_date);
    this.deadline = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  }

  createOpenPass(pass, protection) {
    /***
     * This function builds out the security option.
     * @param {String} pass The pass for the agreement
     * @param {Boolean} protection The trigger for protection option
     */

    var data = {
      "openPassword": pass,
      "protectOpen": protection
    }

    this.pass_option = data;
  }

  updateReminder(reminder) {
    /***
     * Thie function update the reminder API key.
     * @param {Object} reminder Reminder object created in dynamic form
     */

    if (reminder.checked) {
      this.reminders = reminder_dropdown.value;
    }
  }

  updateMessage(msg) {
    /***
     * This section will update the message for the API dynamic form.
     * @param {String} msg Message set in the dynamic form
     */

    this.message = msg;
  }

  clearData() {
    /***
     * This function clears data from the workflow.
     */

    this.file_infos = [];
    this.recipients_list = [];
    this.recipient_group = [];
    this.merge_field_group = [];
  }

  jsonData() {
    /***
     * This function returns the json data formate of the workflow
     */

    if (this.deadline === "") {
      return {
        "documentCreationInfo": {
          "fileInfos": this.file_infos,
          "name": this.agreement_name,
          "recipientsListInfo": this.recipients_list,
          "ccs": this.carbon_copy_group,
          "securityOptions": this.pass_option,
          "mergeFieldInfo": this.merge_field_group,
          "reminderFrequency": this.reminders,
          "message": this.msg
        }
      };
    }
    else {
      return {
        "documentCreationInfo": {
          "fileInfos": this.file_infos,
          "name": this.agreement_name,
          "recipientsListInfo": this.recipients_list,
          "ccs": this.carbon_copy_group,
          "securityOptions": this.pass_option,
          "mergeFieldInfo": this.merge_field_group,
          "daysUntilSigningDeadline": this.deadline,
          "reminderFrequency": this.reminders,
          "message": this.msg
        }
      };
    }
  }
}
