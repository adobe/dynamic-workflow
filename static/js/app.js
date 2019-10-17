async function updateDropdownMenu(workflow_data) {
    /**
     * This function will use the data from the fetch method getLibraryDoc and process the data
     * into the dropdown menu of our html.
     */

        // Declare workflow data and create an empty array
    const workflow_list = await workflow_data;

    // Iterate through workflow data and assign text/value to array for drop-down options
    for (let i = 0; i < workflow_list.length; i++) {
        workflow_list[i].text = workflow_list[i].displayName;
        workflow_list[i].value = workflow_list[i].workflowId;
        delete workflow_list[i].displayName;
        delete workflow_list[i].workflowId;
    }

    // Add elements from options array into the drop down menu
    const selectBox = document.getElementById('workflow_dropdown');
    for (let j = 0, l = workflow_list.length; j < l; j++) {
        const option = workflow_list[j];
        selectBox.options.add(new Option(option.text, option.value, option.selected));
    }
}

function runWorkflow() {
    /**
     *  This is the controller function.
     */

    // Get workflow ID
    var workflow_id = getWorkflowId();

    // Fetch workflow data by ID
    var workflow_data = fetch('/api/getWorkflowById/' + workflow_id)
        .then(function (resp) {
            return resp.json()
        })
        .then(function (data) {
            return data;
        });

    // Fetch application features
    var get_features = fetch('/features')
        .then(function (resp) {
            return resp.json()
        })
        .then(function (data) {
            return data;
        });

    // Create new workflow object for API calls
    var workflow_agreement_data = new Workflow(workflow_id);

    // Grab the parent div from the dynamic form
    var parent_form_div = document.getElementById("recipient_form");

    // Create the dynamic form
    var dynamic_form = new DynamicForm(
        parent_form_div, workflow_data, workflow_agreement_data, get_features);
    dynamic_form.buildRecipientsForm();

    showHiddenDiv();
}

function showHiddenDiv(){
    /**
     * This function will show all hidden divs when workflow is selected
     */

    var hidden_class = document.getElementsByClassName('form_hidden');

    for (let i = 0; i < hidden_class.length; i++) {
        hidden_class[i].style.display = 'block';
    }
}

function getWorkflowId(){
    /**
     * This function will get the workflow id from the selected drop down options.
     */

    let dropdown_selection = document.getElementById("workflow_dropdown");

    return dropdown_selection.options[dropdown_selection.selectedIndex].value;
}

// Fetch all workflow data
var workflow_data = fetch('/api/getWorkflows')
    .then(function (resp) {
        return resp.json()
    })
    .then(function (data) {
        return data;
    });

updateDropdownMenu(workflow_data);