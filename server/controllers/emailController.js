const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');

exports.sendEmail = async(receiver, subject, message) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailbody = {
        from: process.env.EMAIL_ID,
        to: receiver,
        subject: subject,
        text: message
    }

    try {
        await transporter.sendMail(mailbody);
    }
    catch (err) {
        throw new Error(err);
    }
}


exports.verifyEmail = async (req, res) => {
    try {
        const token = req.params.token;

        // Decode and verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Find the user by email (which was encoded in the token)
        const user = await User.findOne({ _id: decoded.id });

        if (!user) {
            return res.status(400).json({
                status: 'fail',
                message: 'User not found',
            });
        }

        // Update user to mark them as verified
        user.isVerified = true;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Email verified successfully! You can now log in.',
        });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message,
        });
    }
};