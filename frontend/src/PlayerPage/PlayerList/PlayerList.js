import React, { Component } from 'react';

class PlayerList extends Component {
  render() {
    const players = this.props.players.map(player => (
      <div key={player._id}>{player.name}</div>
    ));
    const otw = this.props.otw.map(otw => (
      <div key={otw._id}>
        {otw.name} - {otw.distance} miles away as of {otw.timestamp}
      </div>
    ));
    return (
      <>
        <div>{otw}</div>
        <div>{players}</div>
      </>
    );
  }
}

export default PlayerList;
