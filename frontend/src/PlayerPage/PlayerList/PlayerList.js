import React, { Component } from 'react';
import CourtsideCounterApi from '../../util/CourtsideCounterAPI';
// import { getPlayerData } from '../../util/mockAPI';

class PlayerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      currentUser: null
    };
  }

  async componentDidMount() {
    console.log('PL cDM')
    try {
      let currentUser = this.state.currentUser === null ? this.props.currUser : this.state.currentUser
      const players = await CourtsideCounterApi.getPlayers(
        currentUser._token 
      );
      this.setState({ players, currentUser });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    console.log('playerlist render');
    const players = this.state.players.map(player => (
      <div key={player.id}>{player.name}</div>
    ));
    return <div>{players}</div>;
  }
}

export default PlayerList;
