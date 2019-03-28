import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from '../Home';
import AuthForm from '../AuthForm/AuthForm';
import PlayerPage from '../PlayerPage';
import CheckIn from '../CheckIn';

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" render={props => <Home {...this.props} {...props} />} />
        <Route exact path="/login" render={props => <AuthForm {...this.props} {...props} />} />
        <Route exact path="/signup" render={props => <AuthForm {...this.props} {...props} />} />
        <Route
          exact
          path="/players"
          render={props => <PlayerPage {...this.props} {...props} />}
        />
        <Route exact path="/checkin" render={props => <CheckIn {...this.props} {...props} />} />
        <Redirect to="/" />
      </Switch>
    );
  }
}

export default Routes;
