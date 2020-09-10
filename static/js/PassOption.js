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

class PassOption{
  constructor(parent_div, data){
    this.parent_div = parent_div;
    this.required = data['required'];
    this.visable = data['visable'];
    this.default_value = data['defaultValue']
    this.target_div = "";
    this.sub_target_div = "";
    this.input_type = "password";
    this.disabled_button = false;
    this.checked = false;
  }

  createPassDiv(){
    /***
     * This function create cc div
     */

    // Create the element
    var pass_div = document.createElement('div');

    // Add attributes
    pass_div.id = "pass_div";
    pass_div.className = "add_border_bottom";

    var parent_div = document.getElementById('send_options_section')
    parent_div.append(pass_div);

    // Append to parent
    this.target_div = pass_div;

  }

  createCheckbox(){
    /***
     * This function creates the pass required checkbox
     */

    // Create the element
    var checkbox = document.createElement('input')

    // Add attributes
    checkbox.type = "checkbox";
    checkbox.name = "pass_checkbox";
    checkbox.id = "pass_checkbox";

    if(this.required){
      this.checked = true;
      checkbox.checked = true;
      checkbox.disabled = true;
      this.disabled_button = true;
    }

    // Add onclick functions
    checkbox.onclick = function (){
      // Hide sub pass div
      if(document.getElementById("pass_checkbox").checked === true){
        document.getElementById('sub_pass_div').hidden = false;
        this.checked = true;

        // Disable button on empty
        if(document.getElementById("Password").value.length === 0){
          document.getElementById('recipient_submit_button').disabled = true;
        }

        // Reenable submit button if it's disabled
        if (this.disabled_button){
          var submit_button = document.getElementById('recipient_submit_button');
          submit_button.disabled = true;
          this.disabled_button = false;
        }
      }
      // Show sub pass div
      else{
        document.getElementById('sub_pass_div').hidden = true;
        var submit_button = document.getElementById('recipient_submit_button');
        submit_button.disabled = false;
        this.checked = false;;
      }
    }.bind(this)

    // Create the label for the checkbox
    var label = document.createElement('label')
    label.className = "checkbox_input";
    label.htmlFor = "pass_checkbox";

    // Append to parent
    label.appendChild(document.createTextNode('Password Required'));
    this.target_div.appendChild(checkbox);
    this.target_div.appendChild(label);
  }

  createSubPassDiv(){
    /***
     * This function create cc div
     */

    // Create the element
    var sub_pass_div = document.createElement('div');

    // Add attributes
    if(this.required){
      sub_pass_div.hidden = false;
    }
    else{
      sub_pass_div.hidden = true;
    }
    sub_pass_div.id = "sub_pass_div";
    sub_pass_div.className = "add_border_bottom";

    var parent_div = document.getElementById('send_options_section')
    parent_div.append(sub_pass_div);

    // Append to parent
    this.sub_target_div = sub_pass_div;

    // Add to sub div
    this.createPassLabel();
    this.createPassInput('Password');
    this.createPassInput('Confirm Password');
    this.createErrorMsg();
    this.createInputCheckbox();

  }

  createPassLabel(){
    /***
     * This function will add cc label field
     */

    // Create label for recipient
    var label = document.createElement('h3');

    // Add attributes
    label.className = "recipient_label";
    label.innerHTML = "Password must contain 1 to 32 characters.";

    // Append to parent
    this.sub_target_div.append(label);
  }

  createPassInput(placeholder){
    /***
     * This function adds recipients input field
     * @param {String} placeholder Place holder for input
     */

    // Create the element
    var input = document.createElement("input");

    // Add Attributes
    input.type = this.input_type;
    input.id = placeholder;
    input.name = placeholder;
    input.className = 'recipient_form_input';
    input.placeholder = placeholder;
    input.maxLength = 32;

    // Append to parent
    this.sub_target_div.append(input);
  }

  createInputCheckbox(){
    /***
     * This function creates the show pass checkbox
     */

    // Create the element
    var checkbox = document.createElement('input')

    // Add attributes
    checkbox.type = "checkbox";
    checkbox.name = "input_checkbox";
    checkbox.value = "true";
    checkbox.id = "input_checkbox";

    // Add on click to show or disable inputs
    checkbox.onclick = function(){
      if(document.getElementById("input_checkbox").checked === false){
        document.getElementById('Password').type = 'password';
        document.getElementById('Confirm Password').type = 'password';
      }
      else{
        document.getElementById('Password').type = 'text';
        document.getElementById('Confirm Password').type = 'text';
      }
    }.bind(this);

    // Add label to checkbox
    var label = document.createElement('label');
    label.className = "checkbox_input";
    label.htmlFor = "input_checkbox";

    // Append to parent
    label.appendChild(document.createTextNode('Show Password'));
    this.sub_target_div.appendChild(checkbox);
    this.sub_target_div.appendChild(label);
  }

  createErrorMsg(){
    /***
     * This function creates the error message
     */

    // Create label for recipient
    var label = document.createElement('h3');

    // Add attributes
    label.className = "recipient_label error_msg";
    label.innerHTML = "Password Requirment Not Met";
    label.hidden = true;

    // Get divs for validations
    var pass_input = document.getElementById('Password');
    var confirm_input = document.getElementById('Confirm Password');

    // Add validation functions
    this.getValidation(pass_input, label);
    this.getValidation(confirm_input, label);

    // Append to parent
    this.sub_target_div.append(label);
  }

  getValidation(target_div,label){
    /***
     * This function checks for input validations
     * @param {Object} target_div Div to apply event listener
     * @param {Object} label error message label
     */

    target_div.onchange = function(){
      var submit_button = document.getElementById('recipient_submit_button');
      // Enable submit and hide error msg if input matches
      if(document.getElementById("Password").value === document.getElementById("Confirm Password").value
      && document.getElementById('Password').value.length > 0){
        submit_button.disabled = false;
        label.hidden = true;
        this.disabled_button = false;
      }
      // Disable submit, set trigger, and show error message if mismatch
      else{
        submit_button.disabled = true;
        this.disabled_button = true;
        label.hidden = false;
      }
    }.bind(this)
  }

  getPass(){
    /***
     * This function returns the pass
     */
    if(this.checked){
      return document.getElementById('Password').value;
    }
    else{
      return "";
    }
  }

  getProtection(){
    /***
     * This function returns the protection mode
     */

    if(document.getElementById('Password').value === " "){
      return false;
    }
    else{
      return true;
    }
  }
}
