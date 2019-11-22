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

class Deadline {

    constructor(parent_div, deadline_data) {
        this.parent_div = parent_div;
        this.target_div = "";
        this.sub_div = "";
        this.default_value = deadline_data['defaultValue'];
        this.editable = deadline_data['editable'];
        this.visable = deadline_data['visible'];
        this.max_days = deadline_data['maxDays'];
        this.today_date = "";
        this.checked = false;
    }

    createDeadlineDiv() {
        /***
         * This function create deadline div
         */

        // Create the element
        var deadline_div = document.createElement('div');

        // Add attributes
        deadline_div.id = "deadline_div";
        deadline_div.className = "add_border_bottom";

        var parent_div = document.getElementById('deadline_section')
        parent_div.append(deadline_div);

        // Append to parent
        this.target_div = deadline_div;
    }

    createCheckbox() {
        /***
         * This function creates the deadline required checkbox
         */

        // Create the element
        var checkbox = document.createElement('input')

        // Add attributes
        checkbox.type = "checkbox";
        checkbox.name = "deadline_checkbox";
        checkbox.id = "deadline_checkbox";

        // Predefined date will set off triggers
        if(typeof this.default_value !== 'undefined'){
            checkbox.checked = true;
            this.checked = true;
        }

        // Add event
        this.addCheckboxEvent(checkbox);

        // Create the label for the checkbox
        var label = document.createElement('label')
        label.className = "checkbox_input";
        label.htmlFor = "deadline_checkbox";

        // Append to parent
        label.appendChild(document.createTextNode('Completion Deadline'));
        this.target_div.appendChild(checkbox);
        this.target_div.appendChild(label);
    }

    addCheckboxEvent(target) {
        /***
         * This function will add the checkbox for deadlines
         * @param {Object} target The checkbox that we want to add event to
         */

        target.onclick = function () {
            if (document.getElementById("deadline_checkbox").checked === true) {
                document.getElementById('sub_deadline_div').hidden = false;
                this.checked = true;
            }
            // Show sub pass div
            else {
                document.getElementById('sub_deadline_div').hidden = true;
                this.checked = false;
            }
        }.bind(this)
    }

    createSubDiv() {
        /***
         * This function create deadline div
         */

        // Create the element
        var sub_deadline_div = document.createElement('div');

        // Add attributes
        sub_deadline_div.id = "sub_deadline_div";
        sub_deadline_div.className = "add_border_bottom";

        // Predefine deadline will show date picker
        if(typeof this.default_value !== 'undefined'){
            sub_deadline_div.hidden = false;
        }
        else{
            sub_deadline_div.hidden = true;
        }

        var parent_div = document.getElementById('deadline_section')
        parent_div.append(sub_deadline_div);

        // Append to parent
        this.sub_div = sub_deadline_div;

        // Add to sub div
        this.createInput();
    }

    createInput() {
        /***
         * This function creates the deadline required checkbox
         */

        // Create the element
        var deadline_input = document.createElement('input');

        // Add attributes
        deadline_input.type = "date";
        deadline_input.name = "deadline_input";
        deadline_input.id = "deadline_input";
        deadline_input.className = 'recipient_form_input'

        this.setDateValues(deadline_input);
        this.sub_div.append(deadline_input);
    }

    setDateValues(target_input){
        /***
         * This function will add the date time logic
         * @param {Object} target_input The target date input to add date logic
         */

        // Create Date objects
        var today = new Date();
        var max_days = new Date();
        var predefine_date = new Date();

        // Set max days and get string outputs
        this.today_date = this.getDateFormat(today);
        today.setDate(today.getDate() + 1);
        max_days.setDate(today.getDate() + this.max_days);
        var max_days_date = this.getDateFormat(max_days);

        // Set range of dates
        if(typeof this.default_value !== 'undefined'){
            predefine_date.setDate(today.getDate() + Number(this.default_value));
            let predefine_date_format = this.getDateFormat(predefine_date)
            target_input.value = predefine_date_format;
        }
        else{
            target_input.value = this.today_date;
        }

        target_input.min = this.today_date;
        target_input.max = max_days_date;

    }

    addDays(date, days) {
        /***
         * This function will add days to the date
         * @param {Date} date The date object we wish to target
         * @param {Number} days The amount of days added to the target date
         */

        // Create new date object and add the days delta to it
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    getDateFormat(date) {
        /***
         * This function will formate the date for input
         * @param {Date} date The date object we wish to formate
         */

        // Create the day, month, and year variables
        var dd = date.getDate();
        var mm = date.getMonth() + 1;
        var y = date.getFullYear();

        // Month under 10 add leading 0
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }

        // Format
        var date_format = y + '-' + mm + '-' + dd;

        return date_format;
    }

}
