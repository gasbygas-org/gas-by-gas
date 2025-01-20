const admin = require('firebase-admin');
const serviceAccount = require('../config/gas-by-gas-firebase-adminsdk-5fba4-b6c493813f.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // storageBucket: 'bodo-app-18921.firebasestorage.app'
});

const firestore = admin.firestore();
// const bucket = admin.storage().bucket();

module.exports = { admin, firestore };
