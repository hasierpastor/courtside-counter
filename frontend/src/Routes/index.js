import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from '../Home';
import AuthForm from '../AuthForm';
import PlayerList from '../PlayerList';
import Checkin from '../Checkin';

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" render={props => <Home {...props} />} />
        <Route exact path="/login" render={props => <AuthForm {...props} />} />
        <Route exact path="/signup" render={props => <AuthForm {...props} />} />
        <Route
          exact
          path="/players"
          render={props => <PlayerList {...props} />}
        />
        <Route exact path="/checkin" render={props => <Checkin {...props} />} />
        <Redirect to="/" />
      </Switch>
    );
  }
}

export default Routes;
