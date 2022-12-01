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

class CarbonCopy{

    constructor(parent_div, email, id,cc_group_data){
        this.parent_div = parent_div;
        this.email = email;
        this.id = id;
        this.target_div = "";
        this.predefined = false;
		this.cc_group_data = cc_group_data;
    }

    createCcDiv(){
        /***
         * This function create cc div
         */

        // Create the element
        var cc_div = document.createElement('div');
        
        // Add attributes
        cc_div.id = "cc_div_" + this.id;
        cc_div.className = "add_border_bottom";

        var parent_div = document.getElementById('cc_section')
        parent_div.append(cc_div);

        // Append to parent
        this.target_div = cc_div;
    }

    createCcLabelField(){
        /***
         * This function will add cc label field
         */

        // Create label for recipient
        var label = document.createElement('h3');

        // Add attributes
        label.className = "recipient_label";
        label.innerHTML = "CC";

        // Append to parent
        this.target_div.append(label);
    }

    async createCcInputField(hide_all, hide_predefined){
        /***
         * This function adds recipients input field
         */

        // Set features
        let hide_all_trigger = await hide_all;
        let hide_predefined_trigger = await hide_predefined;

        // Create the element
        var input = document.createElement("input");

        // Add Attributes
        input.type = "text";
        input.id = 'cc_' + this.id;
        input.name = 'cc_' + this.id;
        input.className = 'recipient_form_input';
        input.placeholder = "Enter Cc's Email";

        // Add on change event to update user email
        input.onchange = function(){
            this.email = input.value;
        }.bind(this)

        // Append to parent
        this.target_div.append(input);

        // Add predefine tags
        if( typeof this.email !== "undefined"){
            input.value = this.email;
            input.className = input.className + " predefined_input";
            this.predefined = true;
		 if (!(this.cc_group_data['editable'])) {
			input.disabled = true;
		  }
            // Hide all settings turned on
            if(hide_all_trigger && !(hide_predefined_trigger)){
                var recipient_div = document.getElementById("cc_div_" + this.id);
                recipient_div.className = 'recipient_hidden';
            }

            // Hide only defined workflows in config file
            else if(!(hide_all_trigger) && hide_predefined_trigger){
                var recipient_div = document.getElementById("cc_div_" + this.id);
                recipient_div.className = 'recipient_hidden';
            }
        }
    }
}
