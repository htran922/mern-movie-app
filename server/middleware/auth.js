// Only for authorized users
// Bring in user model
const { User } = require('../models/User');

let auth = (req, res, next) => {
    // Check if the token is valid
    let token = req.cookies.x_auth;

    // Find the user who is authenticated or not
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({
            isAuth: false,
            error: true
        });

        // Store the token we found into the request object's token param
        req.token = token;
        // Store the user we found into the request object's user param
        req.user = user;

        next();
    })
}

module.exports = { auth };