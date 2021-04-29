let admin = require('firebase-admin');

let serviceAccount = require('../config/fbProSport-accounts-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://prosport-f09m03.firebaseio.com',
});

module.exports = admin;
