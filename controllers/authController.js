const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // To generate a random token
const nodemailer = require('nodemailer'); // To send emails
const { validationResult } = require('express-validator');
const { User, Packet } = require('../models');
require('dotenv').config();
const { Op } = require("sequelize");
const { generateToken } = require('../utils/jwtUtils');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = await generateToken(
                {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                },
                '1h'
            );
        return res.status(200).json({ 
            message: 'Login successfully',
            user: {
                full_name: user.full_name,
                email: user.email,
            },
            token: token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const forgotPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a random reset token (for example, using crypto)
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Set an expiration time for the token (e.g., 1 hour)
        const resetTokenExpiration = Date.now() + 3600000; // 1 hour

        // Store the token and expiration in the user record (make sure the User model has these fields)
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiration;
        await user.save();

        // Create reset URL
        const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

        // Set up nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can change this to any service you're using
            auth: {
                user: process.env.EMAIL, // Replace with your email
                pass: process.env.PASSWORD, // Replace with your email password
            },
        });

        // Send the email with the reset link
        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Please click the link below to reset your password:\n\n${resetURL}\n\nIf you did not request this, please ignore this email.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Error sending email', error });
            }
            return res.status(200).json({
                message: 'Password reset link has been sent to your email address.'
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred', error });
    }
};

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Find the user by the reset token
        const user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { [Op.gt]: Date.now() } // Ensure the token hasn't expired
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Update the user's password
        user.password = newPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).json({ message: 'Password has been successfully reset' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error resetting password', error });
    }
};

const authPacket = async (req, res) => {
    try {
        const { receipt_number } = req.body;
        const packet = await Packet.findOne({
            where: {
                receipt_number: receipt_number
            }
        });

        if (!packet) {
            return res.status(404).json({ message: 'Packet not found' });
        }

        res.status(200).json({ message: 'Packet authentication successfully', destination: packet.destination });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error });
    }
}

module.exports = { login, forgotPassword, resetPassword, authPacket };
