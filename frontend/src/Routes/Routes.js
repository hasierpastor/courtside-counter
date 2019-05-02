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
        <Route
          exact
          path="/"
          render={props => <Home currUser={this.props.currUser} {...props} />}
        />
        <Route
          exact
          path="/login"
          render={props => <AuthForm {...props} />}
        />
        <Route
          exact
          path="/signup"
          render={props => <AuthForm doSignup={this.props.doSignup} doLogin={this.props.doLogin} currUser={this.props.currUser} {...props} />}
        />
        <Route
          exact
          path="/players"
          render={props => <PlayerPage {...props} currUser={this.props.currUser} />}
        />
        <Redirect to="/" />
      </Switch>
    );
  }
}

export default Routes;
