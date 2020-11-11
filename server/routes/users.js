const express = require('express');
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");

//========================================================================
//                                  User
//========================================================================

app.get("/auth", auth, (req, res) => {
    // We need to send the data from auth to the client in the response object
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastName: req.user.lastName,
        role: req.user.role,
        image: req.user.image
    });
})

app.post('/register', (req, res) => {
    const user = new User(req.body);

    // Use mongoose save method which takes a callback function as a parameter
    // The callback function itself has two parameters: 1) err, should one occur and
    // 2) the document that is inserted into the collection
    user.save((err, doc) => {
        if (err) return res.json({ loginSuccess: false, err });
        res.status(200).json({
            loginSuccess: true
        })
    })
})

app.post('/login', (req, res) => {
    // Find the email
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json({ loginSuccess: false, message: "Auth failed, email not found"});
        }

        // Compare password
        user.comparePassword(req.body.password, (err, isMatch) => {
            // If no match
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Password does not match"})
            

            // Generate token
            // This function takes a callback with two parameters
            // err - if we don't generate the token
            // user - if we successfully get the token
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                // Put token experation into cookie on success
                res.cookie("x_authExp", user.tokenExp);
                // If we are successful, put token we just made into cookie
                // Using cookie-parser middleware
                // Cookie's name is x_auth
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true,
                        userId: user._id
                    })
            })
        });
    })
})

// User logout which requires the user to first be authenticated
app.get('/logout', auth, (req, res) => {
    // What we are doing here is setting the auth token in MongoDB to empty so that
    // authentication is not satisfied
    User.findOneAndUpdate(
        // req.user._id comes from auth.js 
        {_id: req.user._id}, 
        {token: "", tokenExp: ""}, 
        (err, doc) => {
            if (err) return res.json({ logoutSuccess: false, err })
            return res.status(200).send({
                logoutSuccess: true
            })
        }
    )
})

module.exports = router;