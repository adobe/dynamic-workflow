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

class MergeField{

    constructor(parent_div, merge_field_data){
        this.parent_div = parent_div;
        this.target_div = "";
        this.field_name = merge_field_data['fieldName'];
        this.display_name = merge_field_data['displayName'];
        this.default_value = merge_field_data['defaultValue'];
        this.editable = merge_field_data['editable'];
        this.visable = merge_field_data['visible'];
    }

    createMergeFieldDiv(){
        /***
         * This function will add a merge field div
         */

        // Create main div
        var merge_field_div = document.createElement('div');
        merge_field_div.id = "merge_" + this.field_name;
        merge_field_div.className = "merge_div row";

        // Create grids
        var merge_field_col_4 = document.createElement('div');
        merge_field_col_4.className = "col-lg-4";
        var merge_field_col_8 = document.createElement('div');
        merge_field_col_8.className = "col-lg-8";

        var parent_div = document.getElementById('merge_body')
        parent_div.append(merge_field_div);

        // Append to parent
        this.target_div = merge_field_div;
        this.target_div.append(merge_field_col_4);
        this.target_div.append(merge_field_col_8);
    }

    createMergeFieldLabel(){
        /***
         * This function will add a field label
         */

        // Create element
        var merge_field_label = document.createElement('h3');
		if(this.required){
			merge_field_label.id = "required";
		}
        // Add attributes
        merge_field_label.innerText = this.display_name;

        // Append to parent
        this.target_div.children[0].append(merge_field_label);
        // this.target_div.append(merge_field_label);
    }

    createMergeFieldInput(){
        /***
         * This function will add a field input
         */

        // Create element
        var merge_field_input = document.createElement('input');

        // Add attributes
        merge_field_input.className = 'merge_input';
        merge_field_input.id = 'merge_input_' + this.field_name;

        if(this.default_value !== ""){
            merge_field_input.value = this.default_value;
        }

        merge_field_input.onchange = function () {
            this.default_value = merge_field_input.value;
        }.bind(this);

        // Append to parents
        this.target_div.children[1].append(merge_field_input);
    }

}
