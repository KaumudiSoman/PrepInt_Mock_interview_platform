const User = require('./../models/userModel');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: 'success',
            data: {
                users
            }
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'fail',
            error: error?.message || error || 'Unknown error'
        });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user) {
            res.status(404).json({
                status: 'fail',
                error: `User with id ${req.params.id} not found`
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'fail',
            error: error?.message || error || 'Unknown error'
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        if(!user) {
            res.status(404).json({
                status: 'fail',
                error: `User with id ${req.params.id} not found`
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'fail',
            error: error?.message || error || 'Unknown error'
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if(!user) {
            res.status(404).json({
                status: 'fail',
                error: `User with id ${req.params.id} not found`
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'User record deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'fail',
            error: error?.message || error || 'Unknown error'
        });
    }
};