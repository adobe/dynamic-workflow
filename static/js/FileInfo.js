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
    file_info_div.className = 'file_info_div row';

    // Create grid
    var upload_field_col_4 = document.createElement('div');
    upload_field_col_4.className = "col-lg-4";
    var upload_field_col_8 = document.createElement('div');
    upload_field_col_8.className = "col-lg-8";

    var parent_div = document.getElementById('upload_body')
    parent_div.append(file_info_div);

    // Append element to parent
    this.target_div = file_info_div;
    this.target_div.append(upload_field_col_4);
    this.target_div.append(upload_field_col_8);
  }

  createDocumentTitleLabel() {
    /***
     * This function will create the file info title
     */

    // Create the element
    var doc_label = document.createElement('h3');
	if(this.required){
		doc_label.id = "required";
	}
    // Add the attributes
    doc_label.innerText = this.label;

    // Appened element to parent
    this.target_div.children[0].append(doc_label);
  }

  createFileLabelName(required) {
    /***
     * This function will create the file info label
     */

    // If workload has file attachments
    if (this.workflow_lib_doc_id !== null) {
      var file_label_name = document.createElement('h4');
      file_label_name.innerText = this.workflow_lib_doc_id[0]['label'];
      this.target_div.children[1].append(file_label_name);
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
    this.target_div.children[1].append(upload_div);

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
      // Spinner Start
      document.getElementById('recipient_submit_button').disabled = true;
      document.getElementById('loader').hidden = false;

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

      // Spinner End
      document.getElementById('loader').hidden = true;
      document.getElementById('recipient_submit_button').disabled = false;
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
