import React, { Component } from 'react';
import Button from '../Button';
import PlayerList from './PlayerList';

class PlayerPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCheckedIn: false,
      isOTW: false,
      lat: null,
      long: null,
      timestamp: null,
      locationError: null
    };
    this.handleCheckin = this.handleCheckin.bind(this);
  }

  //function that gets the location and return a promise
  getLocationAsync() {
    if (navigator.geolocation) {
      return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(
          function(position) {
            resolve({
              long: position.coords.longitude,
              lat: position.coords.latitude,
              timestamp: position.timestamp
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
      const { lat, long, timestamp } = await this.getLocationAsync();
      console.log(lat, long, timestamp);
      // now that we have lat long, we can
      this.setState({ lat, long, timestamp });
      //api request to handleCheckin
      //
    } catch (e) {
      console.err(e);
      this.setState({ locationError: e });
    }
  }

  render() {
    //replace checkin button with checkout and update status button when someone is checked in
    let statusButtons = {}
    return (
      <>
        <PlayerList currUser={this.props.currUser} />
        <Button handleClick={this.handleCheckin}>Check In</Button>
      </>
    );
  }
}

export default PlayerPage;

// 37.883581, -122.269655
// 37.883625, -122.269153
// 37.883344, -122.269144
// 37.883284, -122.269609
