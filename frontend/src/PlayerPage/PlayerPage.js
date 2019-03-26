import React, { Component } from 'react';
import Button from '../Button';
import PlayerList from './PlayerList';

class PlayerPage extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <PlayerList />
        <Button>Check In</Button>
      </>
    );
  }
}

export default PlayerPage;
