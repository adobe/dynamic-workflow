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

class DynamicForm {

  constructor(parent_div, data, agreement_data, settings, query_params) {
    this.parent_div = parent_div;
    this.workflow_data = data;
    this.agreement_data = agreement_data;
    this.recipient_groups = [];
    this.recipeint_group_id = 0;
    this.file_info = [];
    this.merge_fields = [];
    this.deadline = "";
    this.settings = settings;
    this.cc_group = [];
    this.pass_option = "";
    this.reminders = "";
    this.query_params = query_params;
  }

  async buildRecipientsForm() {
    /**
     * This function will be building out the dynamic recipient group
     */

    // Clear out the old dynamic form
    this.removeRecipientForm('instruction_section');
    this.removeRecipientForm('recipient_section');
    this.removeRecipientForm('cc_section');
    this.removeRecipientForm('agreement_section');
    this.removeRecipientForm('message_section');
    this.removeRecipientForm('upload_section');
    this.removeRecipientForm('merge_section');
    this.removeRecipientForm('deadline_section');
    this.removeRecipientForm('reminder_section');
    this.removeRecipientForm('send_options_section');
    this.removeRecipientForm('form_submit');

    // Hide merge
    document.getElementById('merge_section').hidden = true;

    // Get workflow information
    this.data = await this.workflow_data;

    // Set up triggers for features in config
    let hide_predefined = this.settings.hide_predefined;
    let hide_workflow_list = this.settings.hide_workflow_list;
    let hide_all_trigger = this.settings.hide_predefined && !this.settings.hide_workflow_list.length;
    let hide_predefined_trigger = this.applyHideRule(hide_predefined, hide_workflow_list, this.data['displayName']);

    // Set up cc triggers for features in configs
    let hide_cc = this.settings.hide_cc;
    let hide_cc_workflow_list = this.settings.hide_cc_workflow_list;
    let hide_all_cc_trigger = this.settings.hide_cc && !this.settings.hide_cc_workflow_list.length;
    let hide_cc_predefined_trigger = this.applyHideRule(hide_cc, hide_cc_workflow_list, this.data['displayName']);

    // Build Form Body
    this.createFormTitleField(this.data['displayName']);
    this.createInstructionField(this.data['description']);
    this.creatAgreementLabelField();
    this.createAgreementInputField();
    this.creatMessageLabelField();
    this.createMessageInput();
    this.createLayoutDivs("upload");
    this.createHeaderLabel("upload", "Files");
    this.createLayoutDivs("merge");
    this.createHeaderLabel("merge", "Fields");

    // Hide Extra Options Section
    if (this.settings.disable_extra_options) {
      this.hideExtraOptions();
    }

    // Get Recipient Information
    for (let counter = 0; counter < this.data['recipientsListInfo'].length; counter++) {
      let emailError = this.settings.email_error_message;
      let emailRegex = this.settings.email_regex;
      let recipient_group_data = this.data['recipientsListInfo'][counter];

      this.recipient_groups.push(new RecipientGroup(
        this.recipeint_group_id,
        this.parent_div.children[1].children,
        recipient_group_data,
        emailRegex,
        emailError
      ));
      this.recipient_groups[counter].createRecipientDiv();
      this.recipient_groups[counter].createRecipientLabelField();
      this.recipient_groups[counter].createRecipientInputField(hide_all_trigger, hide_predefined_trigger);

      this.recipeint_group_id++;
    }

    // Get CC Information
    if ('ccsListInfo' in this.data) {
      let cc_group_data = this.data['ccsListInfo'][0];

      //if cc value is not chosen when workflow is created, it sends over the maxListCount as 500 for some silly reason
      let max;
      if (cc_group_data['maxListCount'] === 500) {
        max = 1;
      } else {
        max = cc_group_data['maxListCount'];
      }
      //only occurs if not set. Is user specifically does add a max or min, it sends the right number.
      let cc_group_recipients = cc_group_data['defaultValue'].split(",");
      for (let counter = 0; counter < max; counter++) {
        // If cc group is editable we create the max # of cc recipients
        if (cc_group_data['editable']) {
          this.cc_group.push(new CarbonCopy(this.parent_div.children[0], cc_group_recipients[counter], (counter + 1),cc_group_data))
          this.cc_group[counter].createCcDiv();
          this.cc_group[counter].createCcLabelField();
          this.cc_group[counter].createCcInputField(hide_all_cc_trigger, hide_cc_predefined_trigger);
        }
        // If not editable only create the predefine ones
        else {
          if (counter < cc_group_recipients.length) {
            this.cc_group.push(new CarbonCopy(this.parent_div.children[0], cc_group_recipients[counter], (counter + 1),cc_group_data))
            this.cc_group[counter].createCcDiv();
            this.cc_group[counter].createCcLabelField();
            this.cc_group[counter].createCcInputField(hide_all_cc_trigger, hide_cc_predefined_trigger);
          }
        }
      }
    }

    // Get FileInfo information
    for (let counter = 0; counter < this.data['fileInfos'].length; counter++) {
      let file = this.data['fileInfos'][counter];
      this.file_info.push(new FileInfo(
        this.parent_div.children[1], file['name'], file['label'], file['required'], file['workflowLibraryDocumentSelectorList']));
      this.file_info[counter].createFileInfoDiv();
      this.file_info[counter].createDocumentTitleLabel();
      this.file_info[counter].createFileLabelName(this.file_info[counter]['required']);
    }

    // Get merged field information
    if ('mergeFieldsInfo' in this.data) {
      document.getElementById('merge_section').hidden = false;
      for (let counter = 0; counter < this.data['mergeFieldsInfo'].length; counter++) {
        let merge_field_data = this.data['mergeFieldsInfo'][counter];
        this.merge_fields.push(new MergeField(this.parent_div.children[1], merge_field_data));
        this.merge_fields[counter].createMergeFieldDiv();
        this.merge_fields[counter].createMergeFieldLabel();
        this.merge_fields[counter].createMergeFieldInput();
      }
    }

    // Get Deadline information
    if ('expirationInfo' in this.data) {
      this.deadline = new Deadline(this.parent_div.children[1], this.data['expirationInfo']);
      if (this.deadline.visable) {
        this.deadline.createDeadlineDiv();
        this.deadline.createCheckbox();
        this.deadline.createSubDiv();
      }
    }

    // Get Password information
    if (this.data['passwordInfo'].visible) {
      this.pass_option = new PassOption(this.parent_div.children[1], this.data['passwordInfo']);
      this.pass_option.createPassDiv();
      this.pass_option.createCheckbox();
      this.pass_option.createSubPassDiv();
    }

    // Get Reminder information
    this.reminders = new Reminder(this.parent_div.children[1]);
    this.reminders.createReminderDiv();
    this.reminders.createReminderbox();
    this.reminders.createSubDiv();

    this.createRecipientFormButton(this.agreement_data, this.workflow_data);

    document.getElementById('dynamic_form').hidden = false;

    this.applyDefaultValuesFromQueryParams(this.query_params);

    this.applyListeners();
  }

  valid() {
    const form = document.getElementById('recipient_form');
    return form.checkValidity();
  }

  applyListeners() {
    const form = document.getElementById('recipient_form');
    const checkValidation = () => {
      let submit = document.getElementById('recipient_submit_button');
      submit.disabled = !this.valid();
    }

    form.addEventListener('input', () => { checkValidation() });
    form.addEventListener('change', () => { checkValidation() });
    form.addEventListener('keyup', () => { checkValidation() });
  }

  applyDefaultValuesFromQueryParams(query_params) {
    const entries = query_params.entries();

    for (const entry of entries) {
      if (document.getElementById(entry[0])) {
        //handing checkboxes
        if (document.getElementById(entry[0]).type === 'checkbox') {
          document.getElementById(entry[0]).checked = (entry[1] === 'true');
        } else {
          document.getElementById(entry[0]).value = entry[1];
        }
      }
    }
  }

  async applyHideRule(enabled, itemList, item) {
    /**
     * If enabled and either in list or there is no list.
     */
    if (enabled && itemList.length) {
      return itemList.includes(item);
    }
    return false;
  }

  createFormTitleField(title) {
    /**
     * This function will create the agreement name label
     */

    // Create element
    var title_label = document.createElement('h1');

    // Assign properties
    title_label.innerHTML = title;
    title_label.className = 'recipient_title';

    // Append to parent
    document.getElementById('instruction_section').append(title_label);

  }

  createInstructionField(msg) {
    /**
     * This function will create the agreement name label
     */

    // Create element
    var instruction_label = document.createElement('h3');

    if (window.DOMParser) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(msg, 'text/html');
        instruction_label.innerHTML =  doc.body.textContent;
    } else{
        instruction_label.innerHTML = msg;
    }
    instruction_label.className = 'recipient_label';

    // Append to parent
    document.getElementById('instruction_section').append(instruction_label);

  }

  creatMessageLabelField() {
    /**
     * This function will create the agreement name label
     */

    // Create element
    var message_label = document.createElement('h3');

    // Assign properties
    message_label.innerHTML = "Messages";
    message_label.className = 'recipient_label';

    // Append to parent
    document.getElementById('message_section').append(message_label);
  }

  createMessageInput() {
    /**
     * This function will create the agreement name input field
     */

    // Create element
    var message_input = document.createElement('textarea');

    // Assign properties
    message_input.id = "messages_input";
    message_input.name = 'messages_input';
    message_input.rows = 3;
    message_input.placeholder = "Message";
    message_input.className = 'recipient_form_input';
    message_input.value = this.data['messageInfo']['defaultValue'];

    // Check to see if there's a default value
    if (this.data['messageInfo']['defaultValue'] !== null) {
      message_input.value = this.data['messageInfo']['defaultValue'];
    }

    // Append to parent
    document.getElementById('message_section').append(message_input);

  }

  creatAgreementLabelField() {
    /**
     * This function will create the agreement name label
     */

    // Create element
    var agreement_name_label = document.createElement('h3');

    // Assign properties
    agreement_name_label.innerHTML = "Document Name";
    agreement_name_label.className = 'recipient_label';

    // Append to parent
    var target_div = document.getElementById('agreement_section')
    target_div.append(agreement_name_label);
  }

  createAgreementInputField() {
    /**
     * This function will create the agreement name input field
     */

    // Create element
    var agreement_name_input = document.createElement('input');

    // Assign properties
    agreement_name_input.id = "agreement_name";
    agreement_name_input.name = 'agreement_name';
    agreement_name_input.placeholder = "Enter Agreement Name";
    agreement_name_input.className = 'recipient_form_input';
    agreement_name_input.required = true;

    // Check to see if there's a default value
    if (this.data['agreementNameInfo']['defaultValue'] !== null) {
      agreement_name_input.value = this.data['agreementNameInfo']['defaultValue'];
    }

    // Append to parent
    var target_div = document.getElementById('agreement_section')
    target_div.append(agreement_name_input);
  }

  createLayoutDivs(name) {
    /***
     * This function will create the file info div
     */

    // Create the element
    var file_header_div = document.createElement('div');
    var file_body_div = document.createElement('div');

    // Assign the attributes
    file_header_div.id = name + "_header";
    file_body_div.id = name + "_body";

    // Append
    var parent_div = document.getElementById(name + '_section')
    parent_div.append(file_header_div);
    parent_div.append(file_body_div);
  }

  createHeaderLabel(name, inner_html) {
    /***
     * This function will append the file label to the file header
     */

    // Create the element
    var file_header_label = document.createElement('h3');

    // Assign the attributes
    file_header_label.id = name + "_header_label";
    file_header_label.className = "recipient_label";
    file_header_label.innerHTML = inner_html;

    // Append
    document.getElementById(name + '_header').append(file_header_label);
  }

  async createRecipientFormButton(workflow_object, workflow_data) {
    /***
     * This function will create submit button on the dynamic form
     * @param {Object} workflow_object The object to create workflow agreement
     * @param {Object} workflow_data The object that stores the workflow data
     */
    var async_wf_obj = await workflow_object;
    var wf_data = await workflow_data;

    // Create the button and style it
    var form_button = document.createElement('button');
    form_button.className = "btn btn-primary btn-custom";
    form_button.innerHTML = "Submit";
    form_button.type = "button";
    form_button.id = "recipient_submit_button";
    form_button.disabled = !this.valid();

    // If password is required disable the button
    if (this.pass_option.required) {
      form_button.disabled = true;
    }

    // Add onClick event to submit button
    form_button.onclick = async function () {
      async_wf_obj.updateAgreementName();
      async_wf_obj.updateRecipientGroup(wf_data['recipientsListInfo'], this.recipient_groups);
      async_wf_obj.updateFileInfos(this.file_info);
      async_wf_obj.updateMergeFieldInfos(this.merge_fields);
      async_wf_obj.updateReminder(this.reminders);
      async_wf_obj.updateMessage(document.getElementById('messages_input').value);

      if (wf_data['passwordInfo'].visible) {
        async_wf_obj.createOpenPass(this.pass_option.getPass(), this.pass_option.getProtection());
      }

      if ('expirationInfo' in this.data) {
        if (this.deadline.checked) {
          async_wf_obj.updateDeadline(this.deadline.today_date);
        }
      }

      if ('ccsListInfo' in wf_data) {
        async_wf_obj.updateCcGroup(wf_data['ccsListInfo'][0], this.cc_group);
      }

      document.getElementById('loader').hidden = false;

      var response = await fetch('/api/postAgreement/' + async_wf_obj.workflow_id, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(async_wf_obj.jsonData())
      }).then(function (resp) {
        return resp.json()
      })
        .then(function (data) {
          return data;
        });

      if (this.settings.sign_now) {
        var URlresponse = await fetch('/api/getSigningUrls/' + response.agreementId, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }
        }).then(function (resp) {
          return resp.json()
        })
          .then(function (data) {
            return data;
          });

        if ('signingUrlSetInfos' in URlresponse) {
          window.location.href = URlresponse.signingUrlSetInfos[0].signingUrls[0].esignUrl;
        } else {
          async_wf_obj.clearData();
          alert(URlresponse['message']);
          window.location.reload();
        }
      } else {
        document.getElementById('loader').hidden = true;
        if ('url' in response) {
          alert('Agreement Sent');
          if (self.settings.disable_index) {
            window.location.href = window.location.href.split('?')[0];
          } else {
            window.location.reload();
          }
        } else {
          async_wf_obj.clearData();
          alert(response['message']);
          window.location.reload();
        }
      }
    }.bind(this);

    // Add button to the parent div
    this.parent_div.children['form_submit'].append(form_button);
  }

  removeRecipientForm(target_div) {
    /***
     * This function removes the whole dynamic form
     * @param {Object} target_div The div to the dynamic form
     */

    var removed_div = document.getElementById(target_div);

    while (removed_div.firstChild) {
      removed_div.removeChild(removed_div.firstChild)
    }
  }

  hideExtraOptions() {
    document.getElementById("main-options").classList.replace("col-lg-7", "col-lg-12");
    document.getElementById("extra-options").classList.replace("col-lg-5", "form_hidden");
    document.getElementById("extra-options").hide;
  }
}
