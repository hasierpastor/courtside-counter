const BASE_URL = 'http://localhost:3333';

export default class CourtsideCounterAPI {
  static async signup(user) {
    try {
      console.log(user);
      let response = await fetch(`${BASE_URL}/signup`, {
        method: 'post',
        mode: 'cors',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });
      return response.json();
    } catch (e) {
      throw e;
    }
  }
}
