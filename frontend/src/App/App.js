import React, { Component } from 'react';
import Routes from '../Routes';
import {SECRET} from '../secret';
import jwt from 'jsonwebtoken';
import CourtsideCounterAPI from '../util/CourtsideCounterAPI';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currUser: null
    };
    this.doLogin = this.doLogin.bind(this);
    this.doSignup = this.doSignup.bind(this);
  }

  async doLogin(email) {
    let token = await CourtsideCounterAPI.login({
      email
    });
    const user = await jwt.verify(token, SECRET);
    user._token = token;
    this.setState({ currUser: user });
    localStorage.setItem('token', token);
  }

  async doSignup(name, email) {
    let token = await CourtsideCounterAPI.signup({
      email,
      name
    });
    const user = await jwt.verify(token, SECRET);
    user._token = token;
    this.setState({ currUser: user });
    localStorage.setItem('token', token);
  }

  // doLogout() {

  // }

  async componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {
      const user = await jwt.verify(token, SECRET);
      user._token = token;
     this.setState({ currUser: user });

    }
  }

  render() {
    return <Routes {...this.state} doLogin={this.doLogin} doSignup={this.doSignup} />;
  }
}

export default App;
