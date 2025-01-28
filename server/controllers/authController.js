const UserRepository = require("../repositories/userRepository");
const db = require("../config/db");
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { createTransport } = require("nodemailer");

const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: '3treecrops2@gmail.com',
        pass: 'txjwjrctbiahfldg'
    }
});

exports.register = async (req, res) => {
    const { email, password, phone, nic, name, address, role, uid, token } = req.body;

    try {
        // Verify Firebase token
        const decodedToken = await admin.auth().verifyIdToken(token);
        console.log('Token verified for:', decodedToken.uid);

        // Verify uid matches
        if (decodedToken.uid !== uid) {
            return res.status(401).json({ 
                success: false,
                message: 'Authentication failed' 
            });
        }

        const userRepository = new UserRepository(db);

        // Check for existing credentials
        const nicExists = await userRepository.nicExists(nic);
        if (nicExists) {
            return res.status(400).json({ 
                success: false,
                message: `NIC '${nic}' is already in use` 
            });
        }

        const phoneExists = await userRepository.phoneExist(phone);
        if (phoneExists) {
            return res.status(400).json({ 
                success: false,
                message: `Phone number '${phone}' already exists` 
            });
        }

        // Create user in MySQL
        await userRepository.createUser({
            uid,
            email,
            password,
            phone,
            nic,
            name,
            address,
            role
        });

        res.status(201).json({
            success: true,
            message: 'Registration successful'
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Registration failed'
        });
    }
};

exports.login = async (req, res) => {
    const { email, uid, token } = req.body;

    try {
        // Verify Firebase token
        const decodedToken = await admin.auth().verifyIdToken(token);
        console.log('Token verified for:', decodedToken.uid);

        // Verify uid matches
        if (decodedToken.uid !== uid) {
            return res.status(401).json({ 
                success: false,
                message: 'Authentication failed' 
            });
        }

        const userRepository = new UserRepository(db);
        const user = await userRepository.getUserByUid(uid);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if role exists
        if (!user.role_name) {
            return res.status(400).json({
                success: false,
                message: 'User role not assigned'
            });
        }

        // Generate JWT token with role
        const jwtToken = jwt.sign(
            { 
                uid: user.uId,
                email: user.email,
                role: user.role_name 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token: jwtToken,
            user: {
                uid: user.uId,
                email: user.email,
                name: user.name,
                role: user.role_name,
                phone: user.phone,
                nic: user.nic,
                address: user.address
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Login failed'
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
