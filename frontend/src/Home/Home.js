import React, { Component } from 'react';
import Button from '../Button';

class Home extends Component {
  constructor(props) {
    super(props);
    this.handleSignupClick = this.handleSignupClick.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
  }

  handleLoginClick() {
    this.props.history.push('/login');
  }

  handleSignupClick() {
    this.props.history.push('/signup');
  }
  render() {
    return (
      <>
        <button onClick={this.handleLoginClick}>Login</button>
        <button onClick={this.handleSignupClick}>Sign Up</button>
      </>
    );
  }
}

export default Home;
