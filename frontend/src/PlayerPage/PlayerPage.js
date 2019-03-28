import React, { Component } from 'react';
import Button from '../Button';
import PlayerList from './PlayerList';

class PlayerPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: null,
      long: null, 
      locationError: null,
    };
    this.handleCheckin = this.handleCheckin.bind(this);
  }

  //function that gets the location and accepts a callback
  getLocationAsync() {
    if (navigator.geolocation) {
      return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(
          function(position) {
            resolve({
              long: position.coords.longitude,
              lat: position.coords.latitude
            });
          },
          function(PostionError) {
            reject(PostionError);
          },
          { enableHighAccuracy: true }
        );
      });
    } else {
      throw new Error('Geo Location not supported by browser');
    }
  }

  async handleCheckin() {
    try {
      const {lat, long} = await this.getLocationAsync();
      console.log(lat, long);
      this.setState({lat, long});
    } catch (e) {
      console.err(e);
      this.setState({locationError: e});
    }
  }

  render() {
    return (
      <>
        <PlayerList />
        <Button handleClick={this.handleCheckin}>Check In</Button>
      </>
    );
  }
}

export default PlayerPage;
