import React, { Component } from 'react';
import Routes from '../Routes';
import { SECRET } from '../secret';
import jwt from 'jsonwebtoken';
import CourtsideCounterAPI from '../util/CourtsideCounterAPI';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      currUser: null
    };
    this.doLogin = this.doLogin.bind(this);
    this.doSignup = this.doSignup.bind(this);
  }

  async componentDidMount() {
    console.log('app cDM');
    const token = localStorage.getItem('token');
    if (token) {
      const user = await jwt.verify(token, SECRET);
      user._token = token;
      this.setState({ currUser: user, isLoading: false });
    } else {
      this.setState({ isLoading: false });
    }
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

  render() {
    console.log('render');
    return (
      <Routes
        currUser={this.state.currUser}
        doLogin={this.doLogin}
        doSignup={this.doSignup}
      />
    );
  }
}

export default App;
