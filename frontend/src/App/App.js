import React, { Component } from 'react';
import Routes from '../Routes';

class App extends Component {
  constructor() {
    this.state = {
      currUser: null,
    }
  }

  async componentDidMount() {
    const token = await localStorage.getItem('token');
    const user = jwt.verify(token, )
  }

  render() {
    return <Routes />;
  }
}

export default App;
