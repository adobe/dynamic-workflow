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

class Reminder{

    constructor(parent_div){
        this.parent_div = parent_div;
        this.sub_div = "";
        this.checked = false;
    }

    createReminderDiv(){
        /***
         * This function create reminder div
         */

        // Create the element
        var reminder_div = document.createElement('div');
        
        // Add attributes
        reminder_div.id = "reminder_div";
        reminder_div.className = "add_border_bottom";

        var parent_div = document.getElementById('reminder_section')
        parent_div.append(reminder_div);

        // Append to parent
        this.target_div = reminder_div;
    }
    
    createReminderbox() {
        /***
         * This function creates the reminder checkbox
         */

        // Create the element
        var checkbox = document.createElement('input')

        // Add attributes
        checkbox.type = "checkbox";
        checkbox.name = "reminder_checkbox";
        checkbox.id = "reminder_checkbox";

        // Add event
        this.addCheckboxEvent(checkbox);

        // Create the label for the checkbox
        var label = document.createElement('label')
        label.className = "checkbox_input";
        label.htmlFor = "reminder_checkbox";

        // Append to parent
        label.appendChild(document.createTextNode('Set Reminder'));
        this.target_div.appendChild(checkbox);
        this.target_div.appendChild(label);
    }

    addCheckboxEvent(target){
        /***
         * This function will add the checkbox for deadlines
         * @param {Object} target The checkbox that we want to add event to
         */

        target.onclick = function () {
            if (document.getElementById("reminder_checkbox").checked === true) {
                document.getElementById('sub_reminder_div').hidden = false;
                this.checked = true;
            }
            // Show sub pass div
            else {
                document.getElementById('sub_reminder_div').hidden = true;
                this.checked = false;
            }
        }.bind(this)
    }

    createSubDiv() {
        /***
         * This function create reminder sub div
         */

        // Create the element
        var sub_reminder_div = document.createElement('div');

        // Add attributes
        sub_reminder_div.id = "sub_reminder_div";
        sub_reminder_div.className = "add_border_bottom";

        // Hide div on creation
        if (!(this.checked)){
            sub_reminder_div.hidden = true;
        }

        var parent_div = document.getElementById('reminder_section')
        parent_div.append(sub_reminder_div);

        // Append to parent
        this.sub_div = sub_reminder_div;

        // Add to sub div
        this.createDropDown();
    }

    createDropDown() {
        /***
         * This function will create the reminder dropdown
         */

        // create elements 
        var dropdown = document.createElement('select');
        dropdown.id = 'reminder_dropdown'
        var dropdown_options = {
            'Every day': 'DAILY_UNTIL_SIGNED',
            'Every week': 'WEEKLY_UNTIL_SIGNED',
            'Every business day': 'WEEKDAILY_UNTIL_SIGNED',
            'Every other day': 'EVERY_OTHER_DAY_UNTIL_SIGNED',
            'Every third day': 'EVERY_THIRD_DAY_UNTIL_SIGNED',
            'Every fifth day': 'EVERY_FIFTH_DAY_UNTIL_SIGNED'
        }
		dropdown.value = 'DAILY_UNTIL_SIGNED';
        this.sub_div.append(dropdown)

        for (const [key, value] of Object.entries(dropdown_options)) {
            var select_option = document.createElement('option');
            select_option.value = value;
            select_option.innerHTML = key;
            dropdown.append(select_option);
        }
    }

    
}
