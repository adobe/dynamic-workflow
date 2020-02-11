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

import React, { Component } from 'react';

// Component for managing a list of uploaded files or library documents.
class FileList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      setParentState: props.setParentState,
      getParentState: props.getParentState,
      workflowId: props.workflowId,
      fileInfos: props.fileInfos ? props.fileInfos : []
    };
  }

  componentDidMount() {
    let list = this.state.fileInfos.map((item, i) => {
      if (item.workflowLibraryDocumentSelectorList) {
        return {
          "name": item.name,
          "workflowLibraryDocumentId": item.workflowLibraryDocumentSelectorList[i].workflowLibDoc
        };
      }
      else {
        return {
          "name": item.name,
          "transientDocumentId": ""
        };
      }
    });

    this.state.setParentState({
      fileInfos: list
    });
  }

  // Refresh after selecting another workflow
  static getDerivedStateFromProps(props, state) {
    if (props.workflowId !== state.workflowId &&
      props.fileInfos !== state.fileInfos) {
      return {
        workflowId: props.workflowId,
        fileInfos: props.fileInfos
      };
    }
    return null;
  }

  onFileUpload = async (event, index) => {
    let file = event.target.files[0];
    let transientDocument = await this.state.getParentState().signService.postTransient(file);
    let transientDocumentId = transientDocument.transientDocumentId;

    // Update file item - local state
    this.setState(state => {
      let list = this.state.fileInfos.map((item, i) => {
        if (i === index) {
          item.file = file;
          return item;
        }
        else {
          return item;
        }
      });

      return {
        fileInfos: list
      }
    });

    // Update upload file info - parent state
    this.state.setParentState(state => {
      let list = this.state.getParentState().fileInfos.map((item, i) => {
        if (i === index) {
          if (item.workflowLibraryDocumentSelectorList) {
            return {
              "name": item.name,
              "workflowLibraryDocumentId": item.workflowLibraryDocumentSelectorList[i].workflowLibDoc
            }
          }
          else {
            return {
              "name": item.name,
              "transientDocumentId": transientDocumentId
            }
          }
        }
        else {
          return item;
        }
      });

      return {
        fileInfos: list
      }
    });
  }

  render() {
    return (
      <div>
        <div id="upload_header">
          <h3 id="upload_header_label" className="recipient_label">Files</h3>
        </div>
        <div id="upload_body">
          {
            this.state.fileInfos.map((item, index) =>
              <div className="file_info_div row" id={`file_info_${item.name}`} key={index}>
                <div className="col-lg-4">
                  <h3>{item.label}</h3>
                </div>
                <div className="col-lg-8">
                  <div className="custom-file" id={`upload_${item.name}`}>
                    {item.workflowLibraryDocumentSelectorList ?
                      <div>
                        <h4>
                          {item.workflowLibraryDocumentSelectorList[0].label}
                        </h4>
                      </div> :
                      <div>
                        <input type="file" className="custom-file-input"
                          id={`logo_${item.name}`} onChange={(event) => this.onFileUpload(event, index)}></input>
                        <h4 className="custom-file-label text-truncate">
                          {item.file ? item.file.name : "Please Upload A File"}</h4>
                      </div>
                    }
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default FileList;
