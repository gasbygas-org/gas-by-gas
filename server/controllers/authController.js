const { firestore } = require('../config/firebaseConfig');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const UserRepository = require("../repositories/userRepository");
const db = require("../config/db");
const { createTransport } = require("nodemailer");

const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: '3treecrops2@gmail.com',
        pass: 'txjwjrctbiahfldg'
    }
});

exports.register = async (req, res) => {
    const { email, password, name, role } = req.body;

    try {
        const validRoles = ['user', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: name
        });

        const userData = {
            username: name,
            email: email,
            role: role,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };

        await firestore.collection('users').doc(userRecord.uid).set(userData);

        const userRepository = new UserRepository(db);
        await userRepository.createUser({
            uid: userRecord.uid,
            name,
            email,
            role
        });

        const emailLink = await admin.auth().generateEmailVerificationLink(email, {
            url: 'http://localhost:3000/login', // Front-end URL for redirection
            handleCodeInApp: true
        });

        await transporter.sendMail({
            from: '"Bodo App" <3treecrops2@gmail.com>',
            to: email,
            subject: 'Email Verification Required',
            text: `Click the link below to verify your email:\n${emailLink}`,
            html: `<p>Click the link to verify your email: <a href="${emailLink}">${emailLink}</a></p>`
        });

        console.log('Email Verification Link:', emailLink);

        const jwtToken = jwt.sign({ uid: userRecord.uid, email, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'User registered successfully. Verification email sent.',
            uid: userRecord.uid,
            user: userData,
            token: jwtToken
        });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(400).json({
            message: 'Error creating user',
            error: error.message
        });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Call Firebase REST API to verify email & password
        const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`, {
            email,
            password,
            returnSecureToken: true
        });

        const { localId, idToken, refreshToken, expiresIn } = response.data;

        const userDoc = await firestore.collection('users').doc(localId).get();
        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userData = userDoc.data();
        const { role } = userData;

        const jwtToken = jwt.sign({ uid: localId, email, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            token: jwtToken,
            user: {
                uid: localId,
                email,
                role,
                idToken,
                refreshToken
            }
        });

    } catch (error) {
        res.status(400).json({
            message: 'Invalid email or password',
            error: error.response?.data?.error?.message || 'Authentication failed'
        });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const resetLink = await admin.auth().generatePasswordResetLink(email);

        await transporter.sendMail({
            from: '"Bodo App" <3treecrops2@gmail.com>',
            to: email,
            subject: 'Password Reset Request',
            text: `Click the link below to reset your password:\n${resetLink}`,
            html: `<p>Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`
        });

        res.status(200).json({ message: 'Password reset link sent successfully!' });
    } catch (error) {
        console.error('Error sending password reset link:', error);
        res.status(400).json({ message: 'Failed to send password reset link', error: error.message });
    }
};
