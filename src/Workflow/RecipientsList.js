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

// Component for managing recipients list
class RecipientsList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            setParentState: props.setParentState,
            getParentState: props.getParentState,
            recipientsList: props.recipientsListInfo ? props.recipientsListInfo : [],
            workflowId: props.workflowId,
            hideRecipient: props.features.hideRecipient,
            hideWorkflowList: props.features.hideWorkflowList,
            workflowName: props.workflowName
        };
    }

    // Refresh after selecting another workflow
    static getDerivedStateFromProps(props, state) {
        if (props.workflowId !== state.workflowId) {
            return {
                workflowId: props.workflowId,
                recipientsList: props.recipientsListInfo,
                hidePredefined: props.features.hidePredefined,
                hideWorkflowList: props.features.hideWorkflowList,
                workflowName: props.workflowName
            };
        }
        return null;
    }

    // Event handler when an item in the list changed
    onEmailChanged = (event, index) => {
        const val = event.target.value;
        const emailData = {
            "email": val
        }

        // Update email text for recipient
        this.setState(state => {
            const list = this.state.recipientsList.map((item, i) => {
                if (i === index) {
                    item.defaultValue = val;
                    item.modified = true;
                    return item;
                }
                else {
                    return item;
                }
            });

            return {
                recipientsList: list
            }
        });

        // Update recipient for submission
        this.state.setParentState(state => {
            const list = this.state.getParentState().recipientsList.map((item, i) => {
                if (i === index) {
                    const recipient = {
                        "name": item.name,
                        "recipients": [emailData]
                    }
                    return recipient;
                }
                else {
                    return item;
                }
            });

            return {
                recipientsList: list
            }
        });
    }


    render() {
        const hideRecipient = this.state.hideRecipient;
        const hideWorkflows = (this.state.hideWorkflowList.indexOf(this.state.workflowName) >= 0 ? true : false);
        const hideAll = this.state.hideWorkflowList === "" ? true : false;

        return (
            <div>
                {
                    this.state.recipientsList &&
                    this.state.recipientsList.map((recipient, index) =>
                        <div className={(recipient.defaultValue && hideRecipient && hideWorkflows) ? "recipient_hidden" :
                            (recipient.defaultValue && hideRecipient && hideAll) ? "recipient_hidden" : "add_border_bottom"}
                            id={`recipient_group_${index}`} key={index}>
                            <h3 className="recipient_label">{recipient.label}</h3>
                            <input type="text" id={`recipient_${index}`} name={`recipient_${index}`}
                                className={!recipient.modified ? "recipient_form_input predefined_input" : "recipient_form_input"}
                                placeholder="Enter Recipient's Email" value={recipient.defaultValue}
                                readOnly={recipient.editable ? false : true}
                                onChange={(event) => this.onEmailChanged(event, index)}>
                            </input>
                        </div>
                    )
                }
            </div>
        );
    }
}

export default RecipientsList;