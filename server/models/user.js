const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const moment = require('moment');

// Create Schema
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastName: {
        type: String,
        maxlength: 50
    },
    // Roles are admin and user with default 0 being the user
    role: {   
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String,
    },
    tokenExp: {
        type: Number
    }
})

// Before we save User model into database, we are going to hash password
userSchema.pre('save', function (next){
    var user = this;

    // We should only hash if we modify the password
    if (user.isModified('password')) {

        bcrypt.genSalt(saltRounds, function(err, salt) {
            // When you pass an argument to next(), Express will assume that this was an 
            // error and it will skip all other routes and send whatever we passed to next()
            // to the error handling middleware that was defined
            if (err) return next(err);

            // Hash password
            // hash(data, salt, cb)
            // data - the data to be encrypted
            // salt - the salt to be used to hash the password
            // cb - a callback to be fired once the data has been encrypted; can take two params
                // err - first param to the callback detailing any errors
                // encrypted - second param to the callback providing the encrypted form
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err);
                // Store hash as User password
                user.password = hash;
                next();
            }) 
        })
    // Otherwise we continue without making any hashes 
    } else {
        next();
    }
})

// Create a method to compare passwords
// cb is a callback to be fired once the data has been compared
// cb can take two parameters
// err - first paramter to the callback detailing any errors
// isMatch - second parameter to the callback providing whether the data and
// encrypted forms match [true][false]
userSchema.methods.comparePassword = function(plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        // If we get an err and there's no match
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    })
}

// Create method to generate token
// Will generate token using json web token
userSchema.methods.generateToken = function(cb) {
    // Make variable to refer to user schema
    var user = this;
    console.log('user: ', user);
    console.log('userSchema: ', userSchema)
    // Create the token
    var token = jwt.sign(user._id.toHexString(), 'secret')
    // Token expiration
    var oneHour = moment().add(1, 'hour').valueOf();

    // Define token expiration
    user.tokenExp = oneHour;
    // Store token in user schema
    user.token = token;
    // Use mongoose save method which takes a callback function as a parameter
    // The callback function itself has two parameters: 1) err, should one occur and
    // 2) the document that is inserted into the collection
    user.save(function(err, user){
        if (err) return cb(err) 
        cb(null, user);
    })
}

// User authorization
userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    // Verify the token using jwt
    // After decoding we should get the user id back
    jwt.verify(token, 'secret', function(err, decode) {
        // In the user schema we want to find the user with this id and token
        user.findOne({"_id": decode, "token":token}, function(err, user) {
            if (err) return cb(err);
            // We send this callback back to where we call the findByToken function
            cb(null, user);
        })
    })
}

const User = mongoose.model('User', userSchema);

module.exports = { User }