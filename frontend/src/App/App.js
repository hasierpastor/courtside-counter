import React, { Component } from 'react';
import Routes from '../Routes';
import SECRET from '../../../secret';
import jwt from 'jsonwebtoken';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currUser: null
    };
  }

  async componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {
      const user = await jwt.verify(token, SECRET);
      await this.setState({ currUser: user });
    }
  }

  render() {
    return <Routes {...this.state} />;
  }
}

export default App;
