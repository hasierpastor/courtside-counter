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
    const _token = localStorage.getItem('token');
    if (_token) {
      const user = await jwt.verify(_token, SECRET);
      user._token = _token;
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

    //Adding the token to the user object
    user._token = token;
    this.setState({ currUser: user });
    localStorage.setItem('token', token);
  }

  async doSignup(name, email) {
    let {_token} = await CourtsideCounterAPI.signup({
      email,
      name
    });
    debugger;
    console.log(SECRET);
    console.log('token', _token);
    const user = await jwt.verify(_token, SECRET);
    console.log(user);
    user._token = _token;
    this.setState({ currUser: user });
    localStorage.setItem('token', _token);
  }

  // doLogout() {

  // }

  render() {
    if (this.state.isLoading) {
      return <div>Loading...</div>;
    }
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
