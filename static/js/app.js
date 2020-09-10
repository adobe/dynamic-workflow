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

async function fetchSetting(settings, key, defaultValue, format = null) {
  //create and set a style element if css override is present
  if (key in settings && settings[key]) {
    setting = settings[key]
  } else {
    setting = defaultValue
  }

  if (format == "bool") {
    if (setting == "yes" || setting === true) {
      return true
    } else if (setting == "no" || setting === false) {
      return false
    }
  }
  return setting
}

async function buildSettings() {
  let raw =  await fetch('/features')
    .then(function (resp) {return resp.json()})
    .then(function (data) {return data});
  return {
    css_override: await fetchSetting(raw, "css_override", ""),
    deep_links: await fetchSetting(raw, "deep_links", true, "bool"),
    disable_extra_options: await fetchSetting(raw, "disable_extra_options", false, "bool"),
    disable_index: await fetchSetting(raw, "disable_index", false, "bool"),
    hide_cc: await fetchSetting(raw, "hide_cc", false, "bool"),
    hide_cc_workflow_list: await fetchSetting(raw, "hide_cc_workflow_list", []),
    hide_predefined: await fetchSetting(raw, "hide_predefined", false, "bool"),
    hide_workflow_list: await fetchSetting(raw, "hide_workflow_list", []),
    sign_now: await fetchSetting(raw, "sign_now", true, "bool"),
    x_api_user: await fetchSetting(raw, "x-api-user", ""),
    allowed_workflows: await fetchSetting(raw, "allowed_workflows", []),
    email_regex: await fetchSetting(raw, "email_regex", ""),
    email_error_message: await fetchSetting(raw, "email_error_message", "")
  }
}
const settingSingleton = buildSettings()

async function getSetting(key) {
  let settings = await settingSingleton;
  if (key === undefined) {
    return settings;
  }
  return settings[key];
}

async function updateDropdownMenu(workflow_data) {
  /**
   * This function will use the data from the fetch method getLibraryDoc and process the data
   * into the dropdown menu of our html.
   */
  let workflow_list = await workflow_data;
  let final_list = [];
  let allowedWorkflows = await getSetting('allowed_workflows');

  // Iterate through workflow data and assign text/value to array for drop-down options
  for (let i = 0; i < workflow_list.length; i++) {
    workflow_list[i].text = workflow_list[i].displayName;
    workflow_list[i].value = workflow_list[i].workflowId;

    // if the allowedWorkflows config is set...
    if (allowedWorkflows.length > 0) {
      //...only show workflows on the allowed workflow list, otherwise...
      if (allowedWorkflows.includes(workflow_list[i].workflowId)) {
        console.log('this one is allowed', workflow_list[i].workflowId);
        final_list.push(workflow_list[i]);
      }
    } else {
      //...just add the darn thing and move on
      final_list.push(workflow_list[i]);
    }
  }

  // Add elements from options array into the drop down menu
  const selectBox = document.getElementById('workflow_dropdown');
  for (let j = 0; j < final_list.length; j++) {
    const option = final_list[j];
    // console.log('option being added', option)
    selectBox.options.add(new Option(option.text, option.value, option.selected));
  }
}

async function updateQueryStringParameter(key, value) {
  let uri = window.location.protocol + "//" + window.location.host + window.location.search;
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2');
  }
  else {
    return uri + separator + key + "=" + value;
  }
}

async function updateId(value) {
  newUrl = updateQueryStringParameter('id', value);
  window.history.pushState({}, null, await newUrl)
}

async function runWorkflow(id) {
  /**
   *  This is the controller function.
   */

  // Get workflow ID from deeplink or dropdown selector
  var workflow_id = '';
  if(id) {
    workflow_id = id;
  } else {
    workflow_id = getWorkflowId();
    updateId(workflow_id)
  }

  document.getElementById('dynamic_form').hidden = true;

  // Fetch workflow data by ID
  var workflow_data = await fetch('/api/getWorkflowById/' + workflow_id)
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      return data;
    });

  if(workflow_data.code === 'INVALID_WORKFLOW_ID'){
    alert(workflow_data.message);
  } else {
  // Create new workflow object for API calls
  var workflow_agreement_data = new Workflow(workflow_id);

  // Grab the parent div from the dynamic form
  var parent_form_div = document.getElementById('recipient_form');
  const query_params = new URLSearchParams(window.location.search);

  // Create the dynamic form
  var dynamic_form = new DynamicForm(
    parent_form_div, workflow_data, workflow_agreement_data, await settingSingleton, query_params);
    dynamic_form.buildRecipientsForm();

    showHiddenDiv();
  }
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
  let dropdown_selection = document.getElementById('workflow_dropdown');

  return dropdown_selection.options[dropdown_selection.selectedIndex].value;
}

async function deeplinkCheck() {
  // validate and redirect to deeplink workflow
  let deepLinks = await getSetting('deep_links');
  let disableIndex = await getSetting('disable_index');

  if (deepLinks) {
    let url_params = new URLSearchParams(window.location.search);
    let workflow_id = url_params.get('id');

    if(workflow_id){
      await runWorkflow(workflow_id);
    } else if (disableIndex) {
      createErrorMessage();
    }

    if(!disableIndex){
      document.getElementById("workflow_dropdown").value = workflow_id;
    }
  }

}

async function createWorkflowSelector() {
  // check if dropdown index is disabled and verify deeplinks

  if (await getSetting('disable_index')) {
    document.getElementById('workflow_form_top').hidden = true;
  } else {
    // Fetch all workflow data
    var workflow_data = fetch('/api/getWorkflows')
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data) {
        return data;
      });
    await updateDropdownMenu(workflow_data);
  }
  await deeplinkCheck();
}

async function createErrorMessage() {
  /**
   * This function will create error message if workflow id is not available
   */

  // Create element
  var error_message = document.createElement('h3');

  // Assign properties
  error_message.innerHTML = 'Error: Workflow not found';
  error_message.className = 'error_message';

  // Append to parent
  document.getElementById('workflow_form').append(error_message);
}

async function getCssOverride() {
  //create and set a style element if css override is present
  let cssOverride = await getSetting('css_override');
  if (!cssOverride) { return }

  let stylesheet = document.styleSheets[0];
  let cssList = cssOverride.trim(";").split(";");
  cssList.forEach((cssItem) => {
    stylesheet.insertRule(cssItem, stylesheet.cssRules.length);
  })
}

getCssOverride();
createWorkflowSelector();
