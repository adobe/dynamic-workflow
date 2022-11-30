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

class RecipientGroup {
  constructor(group_id, parent_div, recipient_group_data, email_regex, email_error_message) {
    this.parent_div = parent_div;
    this.email_regex = email_regex;
    this.email_error_message = email_error_message;
    this.group_id = group_id;
    this.recipient_group_data = recipient_group_data;
    this.number_of_members = 0;
    this.target_div = "";
    this.email = "";
    this.required = Boolean(this.recipient_group_data.minListCount);
  }

  createRecipientDiv() {
    /***
     * This function create recipient div
     */

    // Create the element
    var recipient_div = document.createElement('div');

    // Add attributes
    recipient_div.id = "recipient_group_" + this.group_id;
    recipient_div.className = "add_border_bottom";

    var parent_div = document.getElementById('recipient_section')
    parent_div.append(recipient_div);

    // Append to parent
    this.target_div = recipient_div;
  }

  createRecipientLabelField() {
    /***
     * This function will add recipient label field
     */

    // Create label for recipient
    var label = document.createElement('h3');

    // Add attributes
    label.className = "recipient_label";
	if(this.required){
		label.id = "required";
	}
    label.innerHTML = this.recipient_group_data['label'];

    // Append to parent
    this.target_div.append(label)
  }

  async createRecipientInputField(hide_all, hide_predefined) {
    /***
     * This function adds recipients input field
     */

    let hide_all_trigger = await hide_all;
    let hide_predefined_trigger = await hide_predefined;

    // Create the element
    var input = document.createElement("input");

    // Add Attributes
    input.type = "text";
    input.id = 'recipient_' + this.group_id;
    input.name = 'recipient_' + this.group_id;
    input.className = 'recipient_form_input';
    input.placeholder = "Enter Recipient's Email";
    input.pattern = this.email_regex;
    input.title = this.email_error_message;
    input.required = this.required;

    input.onchange = function () {
      this.email = input.value
    }.bind(this);

    // remove ${sender.email} as default value
    if (this.recipient_group_data['defaultValue'] == "${sender.email}") {
      console.warn(input.id + " is set to default to the sender's email.  Default email is sender does not work with dynamic workflow.  This might cause unexpected behaviour.")
      this.recipient_group_data['defaultValue'] = "";
    }

    // If data is not blank, fill it in with predefine information
    if (this.recipient_group_data['defaultValue'] !== "") {
      input.value = this.recipient_group_data['defaultValue'];
      input.className = input.className + " predefined_input"
      this.email = this.recipient_group_data['defaultValue']

      // Disable unedited fields
      if (!(this.recipient_group_data['editable'])) {
        input.disabled = true;
      }

      // Hide all settings turned on
      if (hide_all_trigger && !(hide_predefined_trigger)) {
        var recipient_div = document.getElementById("recipient_group_" + this.group_id);
        recipient_div.className = 'recipient_hidden';
      }

      // Hide only defined workflows in config file
      else if (!(hide_all_trigger) && hide_predefined_trigger) {
        var recipient_div = document.getElementById("recipient_group_" + this.group_id);
        recipient_div.className = 'recipient_hidden';
      }
    }

    this.target_div.append(input);

    // This feature is currently blocked. There's a bug in Adobe API that
    // has been reported. Once this bug is fixed, it will be enabled in
    // the next version.

    // If group is a recipient group
    // if (this.recipient_group_data['maxListCount'] > 1) {
    //     this.createAdditionalRecipientInput(input.id);
    //     this.removeParticipentButton(this.target_div);
    // }
  }

  createAdditionalRecipientInput(recipient_id) {
    /***
     * This function add additions recipeints input
     */

    var add_div = document.createElement('div');
    add_div.id = 'add_section_' + this.group_id;
    add_div.className = "add_section";
    this.target_div.append(add_div);

    // Create the add new recipient button
    var add_marker_button = document.createElement("button");
    add_marker_button.type = "button";
    add_marker_button.id = "add_button";

    // Add onclick function to allow us to create new recipient inputs
    add_marker_button.onclick = function () {
      let new_recipient_id = recipient_id + '_' + this.number_of_members;
      this.number_of_members++;
      this.appendNewParticipentInput(new_recipient_id);
    }.bind(this);

    add_div.append(add_marker_button);

    // Add the plus icon to the button
    var add_recipient_marker = document.createElement("i");
    add_recipient_marker.className = "fa fa-plus";

    add_marker_button.append(add_recipient_marker)
  }

  appendNewParticipentInput(participent_id) {
    /***
     * This functiuon appends a new recipient input
     */

    // Create a line break
    var linebreak = document.createElement("br");

    // Create new input field
    var participent_input = document.createElement('input');
    participent_input.type = "text";
    participent_input.className = "recipient_form_input";
    participent_input.placeholder = "Enter Recipient's Email";
    participent_input.id = participent_id;
    participent_input.name = participent_id;
    participent_input.pattern = this.email_regex;
    participent_input.title = this.email_error_message;

    // Append to the div before buttons
    var target = document.getElementById("add_section_" + this.group_id);
    this.target_div.insertBefore(participent_input, target);
  }

  removeParticipentButton() {
    /***
     * This function removes a recipient
     */

    var remove_button = document.createElement("button");
    remove_button.type = "button";
    remove_button.id = "remove_button";
    remove_button.onclick = function () {
      if (this.number_of_members > 0) {
        // remove input field
        this.target_div.removeChild(this.target_div.querySelectorAll("input")[this.number_of_members]);
        this.number_of_members--;
      }
    }.bind(this);
    document.getElementById('add_section_' + this.group_id).append(remove_button);

    var remove_button_marker = document.createElement("i");
    remove_button_marker.className = "fa fa-minus";
    remove_button.append(remove_button_marker);
  }

}
