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

// Component for managing reminders
class Reminder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            setParentState: props.setParentState,
            getParentState: props.getParentState,
            hasReminderChecked: props.reminderFill ? true : false,
            workflowId: props.workflowId,
            reminders: props.reminderFill ? props.reminderFill : props.reminders
        };

        // Set reminders state in parent
        this.state.setParentState({
            reminders: props.reminderFill ? props.reminderFill : props.reminders
        });
    }

    // Refresh after selecting another workflow
    static getDerivedStateFromProps(props, state) {
        if (props.workflowId !== state.workflowId) {
            return {
                workflowId: props.workflowId,
                hasReminderChecked: props.reminderFill ? true : false,
                reminders: props.reminderFill ? props.reminderFill : props.reminders
            };
        }
        return null;
    }

    // Event handler when checkbox changed
    onCheckboxChanged = (event) => {
        this.setState({ [event.target.name]: event.target.checked });
    }


    // Set reminders state for editing and parent
    onReminderChanged = (event) => {
        this.setState({ reminders: event.target.value });
        this.state.setParentState({ reminders: event.target.value });
    }

    render() {
        let optionState = this.state.reminders;
        return (
            <div className="add_border_bottom" id="reminder_div">
                <input type="checkbox" name="hasReminderChecked" id="reminder_checkbox"
                    checked={this.state.hasReminderChecked} onChange={this.onCheckboxChanged}></input>
                <label className="checkbox_input" htmlFor="reminder_checkbox">Set Reminder</label>
                {
                    this.state.hasReminderChecked &&
                    <div id="sub_reminder_div" className="add_border_bottom">
                        <select id="reminder_dropdown" value={optionState} onChange={this.onReminderChanged}>
                            <option value="DAILY_UNTIL_SIGNED">Every day</option>
                            <option value="WEEKLY_UNTIL_SIGNED">Every week</option>
                            <option value="WEEKDAILY_UNTIL_SIGNED">Every business day</option>
                            <option value="EVERY_OTHER_DAY_UNTIL_SIGNED">Every other day</option>
                            <option value="EVERY_THIRD_DAY_UNTIL_SIGNED">Every third day</option>
                            <option value="EVERY_FIFTH_DAY_UNTIL_SIGNED">Every fifth day</option>
                        </select>
                    </div>
                }
            </div>
        );
    }
}

export default Reminder;
