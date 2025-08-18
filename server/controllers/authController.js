const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const { promisify } = require('util');
const User = require('./../models/userModel');
const emailController = require('./emailController');

const signInToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });
}

const passwordResetToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.PASS_RESET_JWT_EXPIRES_IN });
}

const createRefreshToken = id => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: process.env.REFRESH_JWT_EXPIRES_IN });
}

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.signup = async (req, res) => {
    try {
        let fileUrl = null;
        if (req.file) {
            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `profile-pics/${Date.now()}-${req.file.originalname}`,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            };
            const uploadResult = await s3.upload(params).promise();
            fileUrl = uploadResult.Location;
        }

        const newUser = await User.create({
            username: req.body.userName,
            email: req.body.email,
            contactNo: req.body.contactNo,
            profileImage: fileUrl,
            password: req.body.password
        });

        const token = signInToken(newUser._id);
        const refresh = createRefreshToken(newUser._id);

        newUser.refreshTokens.push(refresh);
        await newUser.save();

        emailController.sendEmail(req.body.email, 'Email Verification', 
            `Please click on following link to verify your email ${process.env.WEBSITE_URL}/verify-email/${token}`)

        res.status(201).json({
            status: 'success',
            token,
            refresh,
            data: {newUser}
        });
        
    }
    catch (error) {
        res.status(500).json({
            status: 'fail',
            error: error?.message || error || 'Unknown error'
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({email});

        if(!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({
                status: 'fail',
                error: 'Incorrect email or password'
            });
        }

        const token = signInToken(user._id);
        const refresh = createRefreshToken(user._id);

        user.refreshTokens.push(refresh);
        await user.save();


        res.status(200).json({
            status: 'success',
            user,
            token,
            refresh
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'error',
            error: 'Something went wrong, please try again later.'
        });
    }
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
            error: 'Please log in to get access'
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
                error: 'User associated with this token no longer exists'
            });
        }

        //If authorization is successful
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({
            status: 'fail',
            error: "Invalid or expired access token"
        });
    }
};

exports.verify = async(req, res, next) => {
    try {
        if (!req.user || !req.user.isVerified) {
            return res.status(403).json({
                status: 'fail',
                error: 'Please verify your email to proceed'
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            status: 'fail',
            error: error?.message || error || 'Unknown error'
        });
    }
}

exports.forgotPassword = async(req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user) {
            return res.status(404).json({
                status: 'fail',
                error: 'Email not matched'
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
    catch (error) { 
        return res.status(500).json({
            status: 'fail',
            error: error?.message || error || 'Unknown error'
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
                error: 'User not found',
            });
        }

        user.password = req.body.password;
        await user.save();

        return res.status(200).json({
            status: 'success',
            message: 'Password reset successfully'
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'fail',
            error: error?.message || error || 'Unknown error'
        });
    }
}

exports.hasPermission = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'fail',
                error: 'You do not have permission to perform this action'
            });
        }
        next();
    }
};

exports.logout = async(req, res) => {
    try {
        const refreshToken = req.headers["x-refresh-token"];
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);

        const user = await User.findById(decoded.id);
        if (user) {
        user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
        await user.save();
        }

        return res.json({
            status: 'success',
            message: "Logged out successfully"
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            error: "Logout failed"
        });
    }
};

exports.refreshTokens = async(req, res) => {
    try {
        const currRefreshToken = req.headers['x-refresh-token'];
        if (!currRefreshToken) {
            return res.status(401).json({
                status: 'fail',
                error: 'Refresh token missing'
            });
        }

        const decoded = jwt.verify(currRefreshToken, process.env.JWT_REFRESH_SECRET_KEY);

        const user = await User.findById(decoded.id);
        if (!user || !user.refreshTokens.includes(currRefreshToken)) {
            return res.status(401).json({
                status: 'fail',
                error: 'User not found'
            });
        }

        const newAccessToken = signInToken(user._id);
        const newRefreshToken = createRefreshToken(user._id);

        user.refreshTokens = user.refreshTokens.filter(t => t !== currRefreshToken);
        user.refreshTokens.push(newRefreshToken);
        await user.save();

        return res.json({
            status: 'success',
            token: newAccessToken,
            refresh: newRefreshToken
        });
    }
    catch (error) {
        return res.status(403).json({
            status: 'fail',
            error: 'Invalid or expired refresh token'
        });
    }
};