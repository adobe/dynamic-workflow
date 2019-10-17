class FileInfo {

    constructor(parent_div, file_name, label, required, workflow_lib_doc_id = null) {
        this.parent_div = parent_div;
        this.file_name = file_name;
        this.label = label;
        this.required = required;
        this.workflow_lib_doc_id = workflow_lib_doc_id;
        this.transient_id = null;
        this.target_div = "";
        this.fileInfo = {};
    }

    createFileInfoDiv() {
        /***
         * This function will create the file info div
         */

        // Create the element
        var file_info_div = document.createElement('div');

        // Assign the attributes
        file_info_div.id = "file_info_" + this.file_name;
        this.parent_div.children['upload_section'].append(file_info_div);

        // Append element to parent
        this.target_div = file_info_div;
    }

    createDocumentTitleLabel() {
        /***
         * This function will create the file info title
         */

        // Create the element
        var doc_label = document.createElement('h3');

        // Add the attributes
        doc_label.innerText = this.label;

        // Appened element to parent
        this.target_div.append(doc_label);
    }

    createFileLabelName(required) {
        /***
         * This function will create the file info label
         */

        // If workload has file attachments
        if (this.workflow_lib_doc_id !== null) {
            var file_label_name = document.createElement('h4');
            file_label_name.innerText = this.workflow_lib_doc_id[0]['label'];
            this.target_div.append(file_label_name);
        }
        // Else create upload field
        else {
            // this.createUploadFieldDiv();
            this.createUploadField(required);
        }
    }

    createUploadFieldDiv(){
        /***
         * This function will create the upload div
         */

        // Create the element
        var upload_div = document.createElement('div');

        // Add attributes
        upload_div.className = 'custom-file';
        upload_div.id = 'upload_' + this.file_name;

        // Append to parent
        this.target_div.append(upload_div);

        return upload_div
    }

    createUploadFileInput(){
        /***
         * This function creates the file upload input.
         */

        // Create element
        var upload_input = document.createElement('input');

        // Add attributes
        upload_input.className = 'custom-file-input';
        upload_input.id = 'logo_' + this.file_name;
        upload_input.type = 'file';

        return upload_input
    }

    createUploadFileLabel(){
        /***
         * This function will create the file label
         */

        // Create the element
        var upload_label = document.createElement('h4');

        // Add attributes
        upload_label.className = 'custom-file-label text-truncate';
        upload_label.innerText = "Please Upload A File";

        return upload_label
    }

    addOnChangeToFileUpload(upload_input, upload_label){
        /***
         * This function will add the on change attribute to file uploads
         * @param {Object} upload_input the div to upload files
         * @param {Object} upload_label the div to change upload file name
         */

        upload_input.onchange = async function () {
            upload_label.innerText = upload_input.files[0]['name'];
            var file = document.getElementById('logo_' + this.file_name);
            var formData = new FormData();
            formData.append('myfile', file.files[0]);

            var response = await fetch('/api/postTransient', {
                method: 'POST',
                body: formData
            }).then(function (resp) {
                return resp.json()
            })
            .then(function (data) {
                return data;
            });

            this.transient_id = response['transientDocumentId'];
        }.bind(this);
    }

    createUploadField(required) {
        /***
         * This function will create the upload field
         */

        let upload_div = this.createUploadFieldDiv();
        let upload_input = this.createUploadFileInput();
        let upload_label = this.createUploadFileLabel();

        this.addOnChangeToFileUpload(upload_input, upload_label)

        if (required) {
            upload_input.required = required;
        }
        upload_div.append(upload_input);
        upload_div.append(upload_label);
    }
}