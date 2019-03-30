import React, { Component } from 'react';
import CourtsideCounterApi from '../../util/CourtsideCounterAPI';
// import { getOTWData } from '../../util/mockAPI';

class OTWList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      OTWPlayers: [],
    };
  }
  
  async componentDidMount() {
    try {
      const OTWPlayers = await CourtsideCounterApi.getOTW(
        this.props.currUser._token 
      );
      this.setState({ OTWPlayers});
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const OTWPlayers = this.state.OTWPlayers.map(player => (
      <div key={player._id}>{player.name}</div>
    ));
    return <div>{OTWPlayers}</div>;
  }
}

export default OTWList;
