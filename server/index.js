const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const cors = require('cors');

const bodyParser = require('body-parser');
// By default Express 4.x or later does not come with middleware to parse cookies
const cookieParser = require('cookie-parser');

const config = require('./config/key');

const port = process.env.PORT || 5000;

// Connect to MongoDB database
const connect = mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => console.log('MongoDB successfully connected'))
    .catch(err => console.log(err));

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); // Support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.json()); // To get JSON data and support parsing of application/json type post data
app.use(cookieParser());
// app.use('/uploads', express.static('uploads')); // Allows for displaying image in NodeJS express server to React client

// Serve static assets if in production mode
if(process.env.NODE_ENV === "production") {
    // Set static folder where all the JS and CSS files will be read and served from
    app.use(express.static("client/build"));

    // Set the index.html for all page routes
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"))
    });
}

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/favorite', require('./routes/favorite'));

app.listen(port, () => { console.log(`Server listening on port ${port}`)})