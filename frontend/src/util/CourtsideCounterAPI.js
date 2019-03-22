const BASE_URL = 'http://localhost:3333';

export default class CourtsideCounterAPI {
  static async signup(user) {
    try {
      let response = await fetch(`${BASE_URL}/signup`, {
        method: 'post',
        header: {
          'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: user
      });
      return response;
    } catch (e) {
      throw e;
    }
  }
}
