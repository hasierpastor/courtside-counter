import React, { Component } from 'react';
import Button from '../Button';
import PlayerList from './PlayerList';
import CourtsideAPI from '../util/CourtsideCounterAPI';

class PlayerPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCheckedIn: false,
      lat: null,
      long: null,
      timestamp: null,
      locationError: null
    };
    this.handleCheckin = this.handleCheckin.bind(this);
    this.handleCheckout = this.handleCheckout.bind(this);
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
      this.setState({ lat, long, timestamp });
      const checkinResponse = this.CourtsideAPI.checkinPlayer(
        this.currentPlayer,
        lat,
        long,
        timestamp
      );
      //
    } catch (e) {
      console.err(e);
      this.setState({ checkinError: e });
    }
  }
  async handleCheckout() {
    try {
      const { lat, long, timestamp } = await this.getLocationAsync();
      await this.CourtsideAPI.checkinPlayer(
        this.currentPlayer,
        lat,
        long,
        timestamp
      );
      this.setState({ lat, long, timestamp, isCheckedIn: true });
    } catch (e) {
      console.err(e);
      this.setState({ checkinError: e });
    }
  }

  render() {
    //replace checkin button with checkout and update status button when someone is checked in
    let statusButtons = this.state.isCheckedIn ? (
      <>
        <Button handleClick={this.handleCheckin}>Update Status</Button>
        <Button handleClick={this.handleCheckout}>Check Out</Button>
      </>
    ) : (
      <Button handleClick={this.handleCheckin}>Check In</Button>
    );

    return (
      <>
        <PlayerList currUser={this.props.currUser} />
        {statusButtons}
      </>
    );
  }
}

export default PlayerPage;

// 37.883581, -122.269655
// 37.883625, -122.269153
// 37.883344, -122.269144
// 37.883284, -122.269609
