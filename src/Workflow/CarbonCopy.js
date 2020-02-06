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

// Component for managing a list of carbon copy groups
class CarbonCopy extends Component {
    constructor(props) {
        super(props);

        let items = CarbonCopy.createCCGroup(props.ccsListInfo);
        let ccEmails = props.ccEmails ? props.ccEmails : [];
        items = this.fillDefaultValue(items, ccEmails);

        this.state = {
            setParentState: props.setParentState,
            getParentState: props.getParentState,
            workflowId: props.workflowId,
            carbonCopyGroup: items,
            hideCC: props.features.hideCC,
            hideCCWorkflowList: props.features.hideCCWorkflowList,
            workflowName: props.workflowName
        };

        props.setParentState(state => {
            return {
                carbonCopyGroup: this.createCcList(items)
            }
        });
    }

    // Fill input with query string
    fillDefaultValue(ccList, ccEmails) {
        if(Array.isArray(ccEmails)) {
            ccEmails.map(email => {
                let cc = ccList.find(c => !c.defaultValue);
                if (cc) {
                    cc.defaultValue = email;
                }
                return email;
            });
        }
        else {
            let cc = ccList.find(c => !c.defaultValue);
            if (cc) {
                cc.defaultValue = ccEmails;
            }
        }
        return ccList;
    }

    // Refresh after selecting another workflow
    static getDerivedStateFromProps(props, state) {
        if (props.workflowId !== state.workflowId) {
            return {
                workflowId: props.workflowId,
                carbonCopyGroup: CarbonCopy.createCCGroup(props.ccsListInfo),
                hideCC: props.features.hideCC,
                hideCCWorkflowList: props.features.hideCCWorkflowList,
                workflowName: props.workflowName
            };
        }
        return null;
    }

    // Create a list of ccs for editing
    static createCCGroup(ccsListInfo) {
        let items = [];
        if (ccsListInfo) {
            ccsListInfo.map((cc, index) => {
                for (let i = 0; i < cc.maxListCount; i++) {
                    let defaultValue = i === 0 ? cc.defaultValue : "";
                    let item = {
                        "label": cc.label,
                        "name": cc.name,
                        "defaultValue": defaultValue
                    }
                    items.push(item);
                }
                return items;
            });
        }

        return items;
    }

    // Creates cc data for submit and group emails by name field
    createCcList(localCCList) {
        let list = [];
        localCCList.map((item, i) => {
            let ccItem = list.find(x => x.name === item.name);
            if (item.defaultValue) {
                if (ccItem) {
                    ccItem.emails.push(item.defaultValue);
                }
                else {
                    // Create new ccItem that contains name and emails
                    let ccData = [item.defaultValue];
                    let ccItem = {
                        "name": item.name,
                        "emails": ccData
                    }
                    list.push(ccItem);
                }
            }
            return ccItem;
        });

        return list;
    }

    // Event handler when an item in the list changed
    onCcChanged = (event, index) => {
        let val = event.target.value;

        let localCCList = this.state.carbonCopyGroup.map((item, i) => {
            if (i === index) {
                item.defaultValue = val;
                item.modified = true;
                return item;
            }
            else {
                return item;
            }
        });

        // Update cc for local edit
        this.setState(state => {
            return {
                carbonCopyGroup: localCCList
            }
        });

        let parentCCList = this.createCcList(localCCList);

        // Update cc list for submit
        this.state.setParentState(state => {
            return {
                carbonCopyGroup: parentCCList
            }
        });
    }

    render() {
        let hideCC = this.state.hideCC;
        let hideCCWorkflows = this.state.hideCCWorkflowList && (this.state.hideCCWorkflowList.indexOf(this.state.workflowName) >= 0) ? true : false;
        let hideAll = this.state.hideCCWorkflowList === "" ? true : false;

        return (
            <div>
                {
                    this.state.carbonCopyGroup &&
                    this.state.carbonCopyGroup.map((cc, i) =>
                        <div className={(cc.defaultValue && hideCC && hideCCWorkflows) ? "recipient_hidden" :
                            (cc.defaultValue && hideCC && hideAll) ? "recipient_hidden" : "add_border_bottom"}
                            id={`cc_div_${i}`} key={i}>
                            <h3 className="recipient_label">{cc.label}</h3>
                            <input type="text" id={`cc_${i}`} name={`cc_${i}`}
                                className={!cc.modified ? "recipient_form_input predefined_input" : "recipient_form_input"}
                                placeholder="Enter Cc's Email" value={cc.defaultValue}
                                onChange={(event) => this.onCcChanged(event, i)}>
                            </input>
                        </div>
                    )
                }
            </div>
        );
    }
}

export default CarbonCopy;