const jwt = require('jsonwebtoken');
const user = {
  email: 'silas@silas.com',
  name: 'silas burger'
};

const token = jwt.sign(user, 'sssshhhhhhhhh');

const getUserData = (delay = 1000) => {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve({token});
    }, delay);
  });
};

export default getUserData;