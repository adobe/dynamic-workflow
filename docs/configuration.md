# Configuration

There is a sample configuration file, `config/config.sample.yaml`, that needs to be copied to `config/config.yaml` and modified for your environment.

There are three main components within the configuration file.

## Server

- `host`: The host address to your Sign Console.
- `endpoint`: This is the API endpoint

## Enterprise

- `integration`:   This is your integration key for Adobe Sign. Please see the integration key section.

## Features

- `hide_predefined`: This turns on the feature to hide predefined recipients in your workflow.
  - `yes`: Turn on
  - `no`: Turn off
- `hide_workflow_list`: A list to target specific workflows to hide predefined recipients.

## Integration Key

You will be required to create an integration key with limited scopes for this application and add the integration key inside the config.yaml file. [Click Me](https://helpx.adobe.com/sign/kb/how-to-create-an-integration-key.html)

![integration key](https://github.com/adobe/dynamic-workflow/raw/master/docs/integration_key.png "Integration Key")
