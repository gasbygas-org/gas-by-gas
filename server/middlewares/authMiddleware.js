const { admin } = require('../config/firebaseConfig');
const UserRepository = require("../repositories/userRepository");
const db = require("../config/db");

// Verify Firebase token
const verifyToken = async (req, res, next) => {
    try {
        console.log('Headers:', req.headers);
        const token = req.headers.authorization?.split('Bearer ')[1];

        if (!token) {
            console.log('No token found in request');
            return res.status(401).json({ 
                success: false,
                message: 'No token provided' 
            });
        }

        // Verify the token
        console.log('Verifying token...');
        const decodedToken = await admin.auth().verifyIdToken(token);
        console.log('Token verified:', decodedToken);
        req.user = decodedToken; // Attach user to request
        next();

    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(401).json({ 
            success: false,
            message: 'Invalid or expired token' 
        });
    }
};

// Check if user exists in MySQL
const requireProfileComplete = async (req, res, next) => {
    try {
        const userRepository = new UserRepository(db);
        const user = await userRepository.getUserByUid(req.user.uid);

        if (!user) {
            return res.status(403).json({ 
                success: false,
                message: 'Please complete registration first' 
            });
        }

        // Attach MySQL user data to request
        req.mysqlUser = user;
        next();
    } catch (error) {
        console.error('Profile check failed:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
};

module.exports = {
    verifyToken,
    requireProfileComplete
};
