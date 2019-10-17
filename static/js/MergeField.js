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

        // Create element
        var merge_field_div = document.createElement('div');

        // Add attributes
        merge_field_div.id = "merge_" + this.field_name;
        this.parent_div.children['merge_section'].append(merge_field_div);

        // Append to parent
        this.target_div = merge_field_div;
    }

    createMergeFieldLabel(){
        /***
         * This function will add a field label
         */

        // Create element
        var merge_field_label = document.createElement('h3');

        // Add attributes
        merge_field_label.innerText = this.display_name;

        // Append to parent
        this.target_div.append(merge_field_label);
    }

    createMergeFieldInput(){
        /***
         * This function will add a field input
         */

        // Create element
        var merge_field_input = document.createElement('input');

        // Add attributes
        merge_field_input.className = 'recipient_form_input';
        merge_field_input.id = 'merge_input_' + this.field_name;

        if(this.default_value !== ""){
            merge_field_input.value = this.default_value;
        }

        merge_field_input.onchange = function () {
            this.default_value = merge_field_input.value;
        }.bind(this);

        // Append to parents
        this.target_div.append(merge_field_input);
    }

}