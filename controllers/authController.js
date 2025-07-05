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
                '7d', // Token expiration time
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

        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiration = Date.now() + 3600000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiration;
        await user.save();

        const resetURL = `https://packet-sorting.vercel.app/reset-password?token=${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        const mailOptions = {
            from: `"Packet Sorting Support" <${process.env.EMAIL}>`,
            to: user.email,
            subject: '🔐 Reset Your Password',
            text: `You requested a password reset. Please go to the following link to reset your password: ${resetURL}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
                    <h2 style="color: #0D47A1;">Packet Sorting - Password Reset</h2>
                    <p>Hello <strong>${user.name || 'User'}</strong>,</p>
                    <p>We received a request to reset your password. Click the button below to proceed:</p>
                    <a href="${resetURL}" style="display: inline-block; background-color: #0D47A1; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                        Reset Password
                    </a>
                    <p>If the button above doesn't work, you can copy and paste the following link into your browser:</p>
                    <p style="word-break: break-all;">${resetURL}</p>
                    <hr />
                    <p style="font-size: 12px; color: #777;">If you didn’t request this, you can safely ignore this email.</p>
                    <p style="font-size: 12px; color: #777;">This link will expire in 1 hour.</p>
                </div>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Error sending email', error });
            }
            return res.status(200).json({
                message: 'Password reset email has been sent. Please check your inbox.'
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

        res.status(200).json({ message: 'Packet authentication successfully', id_packet: packet.id, destination: packet.destination });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error });
    }
}

module.exports = { login, forgotPassword, resetPassword, authPacket };
