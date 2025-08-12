const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('./../models/userModel');
const emailController = require('./emailController')

const signInToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });
}

const passwordResetToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.PASS_RESET_JWT_EXPIRES_IN });
}

const refreshToken = id => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });
}

exports.signup = async (req, res) => {
    try {
        
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            contactNo: req.body.contactNo,
            password: req.body.password
        });

        const token = signInToken(newUser._id);
        emailController.sendEmail(req.body.email, 'Email Verification', 
            `Please click on following link to verify your email ${process.env.WEBSITE_URL}/verify-email/${token}`)

        res.status(201).json({
            status: 'success',
            token,
            data: {
                newUser
            }
        });
        
    }
    catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({email});

    if(!user || !(await user.correctPassword(password, user.password))) {
        res.status(401).json({
            status: 'fail',
            message: 'Incorrect email or password'
        });
    }

    const token = signInToken(user._id);

    res.status(200).json({
        status: 'success',
        user,
        token
    });
};

exports.protect = async (req, res, next) => {
    //Check if the token is present in header and get the token
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        console.log(token);
    }

    if(!token) {
        // return res.redirect('/api/users/login');
        return res.status(401).json({
            status: 'fail',
            message: 'Please log in to get access'
        });
    }

    //Decode the token to get the user id
    try {
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

        //Find user based on decoded id
        const user = await User.findById(decoded.id);

        if(!user) {
            return res.status(401).json({
                status: 'fail',
                message: 'User associated with this token no longer exists'
            });
        }

        //If authorization is successful
        req.user = user;
        next();
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            const refreshToken = req.headers['x-refresh-token'];

            if (!refreshToken) {
                return res.status(401).json({ status: 'fail', message: 'Session expired. Please log in again.' });
            }

            try {
                const decodedRefresh = await promisify(jwt.verify)(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);

                const user = await User.findById(decodedRefresh.id);
                if (!user) {
                    return res.status(401).json({
                        status: 'fail',
                        message: 'User associated with this token no longer exists'
                    });
                }

                //Issue new tokens
                const accessToken = signInToken(user._id);
                const newRefreshToken = refreshToken(user._id);

                res.setHeader('x-access-token', accessToken);
                res.setHeader('x-refresh-token', newRefreshToken);

                req.user = user;
                return next();

            } catch (refreshErr) {
                return res.status(401).json({ status: 'fail', message: 'Refresh token expired. Please log in again.' });
            }
        }
    }
};

exports.verify = async(req, res, next) => {
    try {
        if (!req.user || !req.user.isVerified) {
            return res.status(403).json({
                status: 'fail',
                message: 'Please verify your email to proceed'
            });
        }
        next();
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.forgotPassword = async(req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'Email not matched'
            });
        }

        const token = passwordResetToken(user._id);
        emailController.sendEmail(req.body.email, 'Email Verification', 
            `Please click on following link to verify your email ${process.env.WEBSITE_URL}/reset-password/${token}`);
        
        return res.status(200).json({
            status: 'success',
            message: 'email sent successfully'
        });
    }
    catch (err) { 
        return res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.resetPassword = async(req, res) => {
    try {
        const token = req.params.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(400).json({
                status: 'fail',
                message: 'User not found',
            });
        }

        user.password = req.body.password;
        user.save();

        return res.status(200).json({
            status: 'success',
            message: 'Password reset successfully'
        });
    }
    catch (err) {
        return res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.hasPermission = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'fail',
                message: 'You do not have permission to perform this action'
            });
        }
        next();
    }
};

exports.logout = (req, res) => {
    return res.status(200).json({
        status: 'success',
    })
};