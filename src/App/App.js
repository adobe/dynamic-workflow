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
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import WorkflowSelection from '../Workflow/WorkflowSelection';
import ConfigService from '../Services/ConfigService';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      configService: new ConfigService(),
      features: null
    }
  }

  async componentDidMount() {
    const features = await this.state.configService.getFeatures();
    this.setState({
      features: features
    })
  }

  render() {
    if (!this.state.features)
      return (<div></div>);

    const hideSelector = this.state.features.hideSelector;
    if (hideSelector) {

      // Create routes that show specific workflow via route url
      return (
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/workflow/:name"
            render={(props) => <WorkflowSelection {...props} hideSelector={true} />}
          />
        </Switch>
      );
    }
    else {

      // Create routes that show a list of workflows in default url
      return (
        <Switch>
          <Route exact path="/"
            render={(props) => <WorkflowSelection {...props} hideSelector={false} />}
          />
          <Route path="/workflow/:name"
            render={(props) => <WorkflowSelection {...props} hideSelector={false} />}
          />
        </Switch>
      );
    }
  }

}

export default App;
