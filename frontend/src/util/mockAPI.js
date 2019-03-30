import jwt from 'jsonwebtoken';
import { SECRET } from '../secret';

function getDistanceInMi(lat1, lon1, lat2, lon2) {
  var R = 3958.8; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in mi
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

const user = {
  email: 'silas@silas.com',
  name: 'silas burger'
};

const token = jwt.sign(user, SECRET);

let players = [
  {
    name: 'jorge jadf',
    email: 'jorge@jorge.com',
    timestamp: 1553913171953,
    _id: 2
  },
  {
    name: 'Juan Areces',
    email: 'juan@juan.com',
    timestamp: 1553913171953,
    _id: 3
  }
];

let otw = [
  {
    name: 'asdf',
    email: 'asdf@asdf.com',
    timestamp: 1553913171953,
    _id: 56
  },
  {
    name: 'fdas',
    email: 'fdas@fdas.com',
    timestamp: 1553913171953,
    _id: 23
  }
];

const latUpper = 37.883425;
const latLower = 37.883284;
const longLower = -122.269144;
const longUpper = -122.269655;

const getUserData = (delay = 1000) => {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve(token);
    }, delay);
  });
};

const getPlayerData = (delay = 1000) => {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve(players);
    }, delay);
  });
};

const getOTWData = (delay = 1000) => {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve(otw);
    }, delay);
  });
};

const checkinPlayer = ({ currUser, lat, long, timestamp }) => {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      if (
        lat < latUpper &&
        lat > latLower &&
        long < longUpper &&
        long > longLower
      ) {
        players
          .push({ currUser, timestamp })
          .sort((a, b) => b.timestamp - a.timestamp);
      } else {
        const distance = getDistanceInMi(lat, long, latLower, longLower);
        otw.push({ currUser, timestamp, distance });
      }
      resolve({ message: 'checked in' });
    }, 1000);
  });
};

const checkoutPlayer = ({ currUser, timestamp }) => {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      if (players.indexOf(player => player._id === currUser._id) > -1) {
        players = players.filter(player => player._id !== currUser._id);
      } else {
        otw = otw.filter(player => player._id !== currUser._id);
      }
      resolve({ message: 'checkedout' });
    }, 1000);
  });
};

export { getUserData, getPlayerData, getOTWData };

// 37.883581, -122.269655
// 37.883625, -122.269153
// 37.883344, -122.269144
// 37.883284, -122.269609
