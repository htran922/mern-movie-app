const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const favoriteSchema = mongoose.Schema({

    userFrom: {
        // Allows us to reference the User model
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    movieId: {
        type: String
    },
    movieTitle: {
        type: String
    },
    movieImage: {
        type: String
    },
    movieRuntime: {
        type: String
    }
})

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = { Favorite }