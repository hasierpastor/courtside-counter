const BASE_URL = 'http://localhost:3333';
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
    console.log(email);
    try {
      let response = await axios({
        method: 'post',
        url: `${BASE_URL}/login`,
        data: email
      });
      console.log(response);
      return response.data;
    } catch (e) {
      throw e;
    }
  }
}
