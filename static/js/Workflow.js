class Workflow {

    constructor(workflow_id) {
        this.workflow_id = workflow_id;
        this.agreement_name = "";
        this.file_infos = [];
        this.recipients_list = [];
        this.recipient_group = [];
        this.merge_field_group = [];
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

        for (let i = 0; i < recipient_group_data.length; i++) {
            if (recipient_group_data[i]['defaultValue'] === "") {
                if (recipient_group_data[i]['maxListCount'] !== 1) {
                    let addition_recipient = recipient_groups[i]['target_div'].querySelectorAll('input');

                    for (let recipient_counter = 0; recipient_counter < addition_recipient.length; recipient_counter++) {
                        this.addToRecipientGroup(addition_recipient[recipient_counter].value);
                    }
                } else {
                    let recipient_id = document.getElementById("recipient_" + i);
                    this.addToRecipientGroup(recipient_id.value);
                }
            } else {
                this.addToRecipientGroup(recipient_group_data[i]['defaultValue'])
            }

            this.addToRecipientsList(recipient_group_data[i]['name']);
            this.clearRecipientGroup();
        }
    }

    addToRecipientGroup(email) {
        /***
         * This function add a new user to a recipient group
         * @param {String} email Email of recipients
         */

        var data = {
            "email": email
        };

        this.recipient_group.push(data)
    }

    clearRecipientGroup() {
        /***
         * This function clear recipients group
         */
        this.recipient_group = [];
    }

    addToRecipientsList(name) {
        /***
         * This function add recipient groups to the overall list of recipeints
         * @param {String} name Name of the recipient group
         */

        var data = {
            "name": name,
            "recipients": this.recipient_group
        };

        this.recipients_list.push(data);
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
            } else if(file_infos[i]['transient_id'] !== null){
                this.file_infos.push(
                    {
                        "name": file_infos[i]['file_name'],
                        "transientDocumentId": file_infos[i].transient_id
                    }
                )
            }
        }
    }

    updateMergeFieldInfos(merge_fields){
        /***
         * This function allows merging of user input
         * @param {String} merge_fields Fields for user input to be merged
         */

        for( let counter = 0; counter < merge_fields.length; counter++){
            let merge_data = {
                'defaultValue': merge_fields[counter].default_value,
                'fieldName': merge_fields[counter].field_name
            };
            this.merge_field_group.push(merge_data)
        }
    }

    clearData(){
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

        return {
            "documentCreationInfo": {
                "fileInfos": this.file_infos,
                "name": this.agreement_name,
                "recipientsListInfo": this.recipients_list,
                "mergeFieldInfo": this.merge_field_group
            }
        };
    }
}