import React, { Component } from 'react';
import Button from '../Button';

class Home extends Component {
  constructor(props) {
    super(props);
    this.handleSignupClick = this.handleSignupClick.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
  }

  handleLoginClick(e) {
    e.preventDefault();
    this.props.history.push('/login');
  }

  handleSignupClick(e) {
    e.preventDefault();
    this.props.history.push('/signup');
  }
  render() {
    return (
      <>
        <button onClick={this.handleLoginClick} />
        <button onClick={this.handleSignupClick} />
      </>
    );
  }
}

export default Home;
