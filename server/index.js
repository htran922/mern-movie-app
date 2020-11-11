const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// By default Express 4.x or later does not come with middleware to parse cookies
const cookieParser = require('cookie-parser');

const config = require('./config/key');

const { User } = require('./models/User');
const { auth } = require('./middleware/auth');

const port = process.env.PORT || 5000;

// Connect to MongoDB database
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => console.log('MongoDB successfully connected'))
    .catch(err => console.log(err));


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.get("/api/users/auth", auth, (req, res) => {
    // We need to send the data from auth to the client in the response object
    res.status(200).json({
        _id: req._id,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastName: req.user.lastName,
        role: req.user.role,
    })
})

app.post('/api/users/register', (req, res) => {
    const user = new User(req.body);

    // Use mongoose save method which takes a callback function as a parameter
    // The callback function itself has two parameters: 1) err, should one occur and
    // 2) the document that is inserted into the collection
    user.save((err, doc) => {
        if (err) return res.json({ loginSuccess: false, err });
        res.status(200).json({
            loginSuccess: true,
            userData: doc
        })
    })
})

app.post('/api/users/login', (req, res) => {
    // Find the email
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json({ loginSuccess: false, message: "Auth failed, email not found"});
        }

        // Compare password
        user.comparePassword(req.body.password, (err, isMatch) => {
            // If no match
            if (!isMatch) {
                return res.json({ loginSuccess: false, message: "Password does not match"})
            }
        })

        // Generate token
        // This function takes a callback with two parameters
        // err - if we don't generate the token
        // user - if we successfully get the token
        user.generateToken((err, user) => {
            if (err) return res.status(400).send(err);
            // If we are successful, put token we just made into cookie
            // Using cookie-parser middleware
            // Cookie's name is x_auth
            res.cookie("x_auth", user.token)
                .status(200)
                .json({
                    loginSuccess: true
                })
        })
    })
})

// User logout which requires the user to first be authenticated
app.get('/api/users/logout', auth, (req, res) => {
    // What we are doing here is setting the auth token in MongoDB to empty so that
    // authentication is not satisfied
    User.findOneAndUpdate(
        // req.user._id comes from auth.js 
        {_id: req.user._id}, 
        {token: ""}, 
        (err, doc) => {
            if (err) return res.json({ success: false, err })
            return res.status(200).send({
                logoutSuccess: true
            })
        }
    )
})

app.listen(port, () => { console.log(`Server listening on port ${port}`)})