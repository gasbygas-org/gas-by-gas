const admin = require('firebase-admin');
const serviceAccount = require('./gas-by-gas-firebase-adminsdk-5fba4-3c49fafce.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // storageBucket: 'bodo-app-18921.firebasestorage.app'
});

const firestore = admin.firestore();
// const bucket = admin.storage().bucket();

module.exports = { admin, firestore };
