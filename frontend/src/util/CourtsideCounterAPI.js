const BASE_URL = 'http://192.168.1.64:3333';
const axios = require('axios');

export default class CourtsideCounterAPI {
  static async signup(user) {
    try {
      let response = await axios({
        method: 'post',
        url: `${BASE_URL}/signup`,
        data: user
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  }


  static async login(email) {
    try {
      let response = await axios({
        method: 'post',
        url: `${BASE_URL}/login`,
        data: email
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  static async getPlayers(token) {
    try {
      let response = await axios({
        method: 'get',
        url: `${BASE_URL}/players`,
        data: token
      });
      console.log(response);
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  static async deletePlayer(token) {
    try {
      let response = await axios({
        method: 'delete',
        url: `${BASE_URL}/players`, 
        data: token
      });
      console.log(response);
      return response.data;
    } catch (e) {
      throw e;
    }
  }
  static async addPlayer(token) {
    try {
      let response = await axios({
        method: 'post',
        url: `${BASE_URL}/players`, 
        data: token
      });
      console.log(response);
      return response.data;
    } catch (e) {
      throw e;
    }
  }
}
