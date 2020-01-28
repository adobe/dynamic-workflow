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
class Deadline extends Component {
    constructor(props) {
        super(props);
        
        const date = Deadline.getNextDay();
        this.state = {
            setParentState: props.setParentState,
            getParentState: props.getParentState,
            workflowId: props.workflowId,
            hasDeadlineChecked: true,
            visible: props.deadlineVisible,
            date: date,
            deadline: props.deadline
        };
        // console.log(this.state.deadline);

        this.state.setParentState({ deadline: this.getDaysTillDeadline(date) });
    }

    // Refresh after selecting another workflow
    static getDerivedStateFromProps(props, state) {
        if (props.workflowId !== state.workflowId) {
            return {
                workflowId: props.workflowId,
                workflow: props.workflow,
                hasDeadlineChecked: true,
                visible: props.deadlineVisible,
                date: Deadline.getNextDay()
            };
        }
        return null;
    }

    // Get date for next day
    static getNextDay() {
        let date = new Date();
        date.setDate(date.getDate() + 1);

        const dd = ("0" + (date.getDate())).slice(-2);
        const mm = ("0" + (date.getMonth() +　1)).slice(-2);
        const yyyy = date.getFullYear();
        date = yyyy + '-' + mm + '-' + dd ;

        return date;
    }

    // Get number of days until signing deadline
    getDaysTillDeadline(selectedDate) {
        const todayDate = new Date();
        const dateInput = new Date(selectedDate);
        const diffTime = Math.abs(dateInput - todayDate);
        const expirationInfo = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return expirationInfo;
    }

    // Event handler when checkbox changed
    onCheckboxChanged = (event) => {
        this.setState({ [event.target.name]: event.target.checked });

        if (!event.target.checked) {
            this.state.setParentState({ deadline: '' });
        }
    }

    // Event handler when deadline changed
    onDeadlineChanged = (event) => {
        const selectedDate = event.target.value;
        this.setState({
            date: selectedDate
        });

        this.state.setParentState({ deadline: this.getDaysTillDeadline(selectedDate) });
    }

    render() {
        return (
            this.state.visible ?
            <div className="add_border_bottom" id="deadline_div">
                <input type="checkbox" name="hasDeadlineChecked" id="deadline_checkbox" 
                    checked={this.state.hasDeadlineChecked} onChange={this.onCheckboxChanged}></input>
                <label className="checkbox_input" htmlFor="deadline_checkbox">Completion Deadline</label>
                {
                    this.state.hasDeadlineChecked &&
                    <div id="sub_deadline_div" className="add_border_bottom">
                        <input type="date" name="deadline" id="deadline_input" value={this.state.date}
                            className="recipient_form_input" onChange={this.onDeadlineChanged}></input>
                    </div>
                }
            </div> : (<div></div>)
        );
    }
}

export default Deadline;