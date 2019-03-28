import React, { Component } from 'react';
import CourtsideCounterApi from '../../util/CourtsideCounterAPI';
// import { getPlayerData } from '../../util/mockAPI';

class PlayerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: []
    };
  }

  async componentDidMount() {
    try {
      const players = await CourtsideCounterApi.getPlayers();
      this.setState({ players });
    } catch (err) {
      console.err(err);
    }
  }

  render() {
    const players = this.state.players.map(player => (
      <div key={player.id}>{player.name}</div>
    ));
    return <div>{players}</div>;
  }
}

export default PlayerList;
