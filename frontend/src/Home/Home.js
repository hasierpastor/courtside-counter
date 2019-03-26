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
        <Button handleClick={this.handleLoginClick}>Login</Button>
        <Button handleClick={this.handleSignupClick}>Sign Up</Button>
      </>
    );
  }
}

export default Home;
