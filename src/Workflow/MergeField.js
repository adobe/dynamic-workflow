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

// Component for managing merge fields
class MergeField extends Component {
    constructor(props) {
        super(props);

        let mergeFieldList = props.mergeFieldsInfo ? props.mergeFieldsInfo : [];
        let fields = props.fields ? props.fields : [];
        mergeFieldList = this.fillDefaultValue(mergeFieldList, fields);

        this.state = {
            setParentState: props.setParentState,
            getParentState: props.getParentState,
            workflowId: props.workflowId,
            mergeFieldList: mergeFieldList
        };
    }

    fillDefaultValue(fieldList, fields) {
        if(Array.isArray(fields)) {
            fields.map(item => {
                const field = fieldList.find(f => !f.defaultValue);
                if (field) {
                    field.defaultValue = item;
                }
                return item;
            });
        }
        else {
            const field = fieldList.find(r => !r.defaultValue);
            if (field) {
                field.defaultValue = fields;
            }
        }
        return fieldList;
    }

    // Refresh after selecting another workflow
    static getDerivedStateFromProps(props, state) {
        if (props.workflowId !== state.workflowId) {
            return {
                workflowId: props.workflowId    
            };
        }
        return null;
    }

    // Event handler when an item in the list changed
    onFieldChanged = (event, index) => {
        const val = event.target.value;

        this.state.setParentState(state => {
            const list = this.state.getParentState().mergeFieldGroup.map((item, i) => {
                if (i === index) {
                    const fieldData = {
                        "displayName": item.displayName,
                        "defaultValue": val,
                        "fieldName": item.fieldName
                    }
                    return fieldData;
                }
                else {
                    return item;
                }
            });

            return {
                mergeFieldGroup: list
            }
        });
    }

    render() {
        const mergeFieldGroup = this.state.getParentState().mergeFieldGroup;
        const showMergeField = mergeFieldGroup && mergeFieldGroup.length >  0;
        return (
            <div>
                { showMergeField &&
                    <div>
                        <div id="merge_header">
                            <h3 id="merge_header_label" className="recipient_label">Fields</h3>
                        </div>
                        <div id="merge_body">
                            {
                                mergeFieldGroup.map((item, index) =>
                                    <div className="merge_div row" id={`merge_${item.fieldName}`} key={index}>
                                        <div className="col-lg-4">
                                            <h3>{item.displayName}</h3>
                                        </div>
                                        <div className="col-lg-8">
                                            <input type="text" className="merge_input" value={item.defaultValue}
                                                id={`merge_input_${item.fieldName}`} onChange={(event) => this.onFieldChanged(event, index)}></input>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default MergeField;