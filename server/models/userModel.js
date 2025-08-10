const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        maxlength: [20, 'Username can not have more than 20 characters']
    },
    email: {
        type: String,
        requierd: [true, 'Email is required'],
        trim: true,
        unique: false
    },
    role: {
        type: String,
        enum: ['ADMIN', 'USER'],
        default: 'USER'
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must have atleast 8 characters'],
        maxlength: [60, 'Password can not have more than 60 characters'],
        trim: true
    },
    contactNo: {
        type: String,
        required: [true, 'Contact number of the user is required']
    },
    profileImage: {
        type: String,
        default: "C:/Users/kaumu/Desktop/Vasudha.jpg"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model('User', userSchema);

module.exports = User;