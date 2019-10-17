class DynamicForm {

    constructor(parent_div, data, agreement_data, features) {
        this.parent_div = parent_div;
        this.workflow_data = data;
        this.agreement_data = agreement_data;
        this.recipient_groups = [];
        this.recipeint_group_id = 0;
        this.file_info = [];
        this.merge_fields = [];
        this.features = features;
    }

    async buildRecipientsForm() {
        /**
         * This function will be building out the dynamic recipient group
         */

        // Clear out the old dynamic form
        this.removeRecipientForm('agreement_section');
        this.removeRecipientForm('recipient_section');
        this.removeRecipientForm('upload_section');
        this.removeRecipientForm('merge_section');
        this.removeRecipientForm('button_section');

        // Get workflow information
        this.data = await this.workflow_data;

        // Set up triggers for features in config
        let hide_predefined_setting = this.getHidePredefinedSetting();
        let hidden_list = this.getHiddenWorkflowList();
        let hide_all_trigger = this.setHideAllTrigger(hide_predefined_setting, hidden_list);
        let hide_predefined_trigger = this.setHidePredefinedTrigger(
            hide_all_trigger, hide_predefined_setting, this.data['displayName'], hidden_list);

        this.creatAgreementLabelField();
        this.createAgreementInputField();

        // Get Recipient Information
        for (let counter = 0; counter < this.data['recipientsListInfo'].length; counter++) {

            let recipient_group_data = this.data['recipientsListInfo'][counter];

            this.recipient_groups.push(new RecipientGroup(
                this.recipeint_group_id, this.parent_div, recipient_group_data));
            this.recipient_groups[counter].createRecipientDiv();
            this.recipient_groups[counter].createRecipientLabelField();
            this.recipient_groups[counter].createRecipientInputField(hide_all_trigger, hide_predefined_trigger);

            this.recipeint_group_id++;
        }

        // Get FileInfo information
        for (let counter = 0; counter < this.data['fileInfos'].length; counter++) {
            let file = this.data['fileInfos'][counter];
            this.file_info.push(new FileInfo(
                this.parent_div, file['name'], file['label'], file['required'], file['workflowLibraryDocumentSelectorList']));
            this.file_info[counter].createFileInfoDiv();
            this.file_info[counter].createDocumentTitleLabel();
            this.file_info[counter].createFileLabelName(this.file_info[counter]['required']);
        }

        // Get merged field information
        if ('mergeFieldsInfo' in this.data) {
            for (let counter = 0; counter < this.data['mergeFieldsInfo'].length; counter++) {
                let merge_field_data = this.data['mergeFieldsInfo'][counter];
                this.merge_fields.push(new MergeField(this.parent_div, merge_field_data));
                this.merge_fields[counter].createMergeFieldDiv();
                this.merge_fields[counter].createMergeFieldLabel();
                this.merge_fields[counter].createMergeFieldInput();
            }
        }

        this.createRecipientFormButton(this.agreement_data, this.workflow_data);
    }

    async getHidePredefinedSetting(){
        /***
         * This function gets the hide_predefined setting from the config file
         */

        let hide_predefined_setting = await this.features;

        return hide_predefined_setting['hide_predefined'];
    }

    async getHiddenWorkflowList(){
        /***
         * This function gets the hide_workflow_list from the config file
         */

        let feature = await this.features;

        return feature['hide_workflow_list'];
    }

    async setHideAllTrigger(settings, hidden_list){
        /***
         * This function sets the hide all trigger for predefined workflows.
         * @param {Object} setting Hide_Predefined settings
         * @param {Object} hidden_list Hide_Workflw_List
         */

        this.settings = await settings;
        this.hidden_list = await hidden_list;
        let hide_all_trigger = false

        if(this.settings === 'yes' && this.hidden_list === null){
            hide_all_trigger = true;
        }

        return hide_all_trigger;

    }

    async setHidePredefinedTrigger(hide_all_trigger, hide_predefined_setting, workflow_name, hidden_list){
        /***
         * This function sets the hide_predefed trigger for workflows
         * @param {Object} hide_all_trigger Hide all trigger settings
         * @param {Object} hide_predefined_setting Hide predefined settings
         * @param {String} workflow_name Selected workflow name
         * @param {Object} hidden_list Hidden list from config
         */

        let trigger = await hide_all_trigger;
        let settings = await hide_predefined_setting;
        let list = await hidden_list;
        var hide_predefined_trigger = false;
        
        if(!(trigger)){
            if(settings === 'yes'){
                hide_predefined_trigger = list.includes(workflow_name);   
            }
        }

        return hide_predefined_trigger;
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
        this.parent_div.children['agreement_section'].append(agreement_name_label);
    }

    createAgreementInputField(){
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
        this.parent_div.children['agreement_section'].append(agreement_name_input);
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

        // Add onClick event to submit button
        form_button.onclick = async function () {
            async_wf_obj.updateAgreementName();
            async_wf_obj.updateRecipientGroup(wf_data['recipientsListInfo'], this.recipient_groups);
            async_wf_obj.updateFileInfos(this.file_info);
            async_wf_obj.updateMergeFieldInfos(this.merge_fields);

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

            if('url' in response){
                alert('Agreement Sent');
                window.location.reload();
            }else{
                async_wf_obj.clearData();
                alert(response['message']);
            }
        }.bind(this);

        // Add button to the parent div
        this.parent_div.children['button_section'].append(form_button);
    }

    removeRecipientForm(target_div) {
        /***
         * This function removes the whole dynamic form
         * @param {Object} target_div The div to the dynamic form
         */

        var removed_div = this.parent_div.children[target_div];

        while (removed_div.firstChild) {
            removed_div.removeChild(removed_div.firstChild)
        }
    }
}