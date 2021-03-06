const express = require('express');
const router = express.Router();
const { Favorite } = require("../models/Favorite");

//========================================================================
//                                  Favorite
//======================================================================== 

router.post('/favoriteNumber', (req, res) => {
    // Find information about 'favorite movie' inside Favorite collection by movidId
    Favorite.find({"movieId": req.body.movieId})
        .exec((err, favorite) => {
            if(err) return res.status(400).send(err)
            res.status(200).json({ success: true, favoriteNumber: favorite.length })
        })
});

router.post('/favorited', (req, res) => {
    // Find information on whether user already added this movie to their favorite list
    // Look inside the Favorite collection and find by movieId and userFrom (which is the user ID)
    Favorite.find({"movieId": req.body.movieId, "userFrom": req.body.userFrom})
        // Execute query, passing results to a callback
        .exec((err, favorite) => {
            if(err) return res.status(400).send(err)

            // TODO: How can we know if user already favorited this movie or not?
            
            let result = false;     // False means user did not add movie as favorite (this is by default)
            if (favorite.length !== 0) {
                // Means already added as favorite movie
                result = true;
            }

            res.status(200).json({
                success: true,
                favorited: result
            })



        })
});

router.post('/addToFavorite', (req, res) => {
    // Save the information about the movie or user id inside the Favorite collection
    const favorite = new Favorite(req.body);

    favorite.save((err, doc) => {
        if (err) return res.json({ success: false, err })
        res.status(200).json({ success: true })
    }) 
})

router.post('/removeFromFavorite', (req, res) => {
    // Find the favorited movie by movie id and delete it
    Favorite.findOneAndDelete({ movieId: req.body.movieId , userFrom: req.body.userFrom })
    .exec((err, doc) => {
        if(err) return res.status(400).json({ success: false, err })
        res.status(200).json({ success: true, doc })
    })

})

router.post('/getFavoriteMovies', (req, res) => {
    // Find all the movies the user added as favorite movies
    Favorite.find({ 'userFrom': req.body.userFrom })
        .exec((err, myFavoriteMovies) => {
            if(err) return res.status(400).send(err);
            return res.status(200).json({ success: true, myFavoriteMovies })
        })

})


module.exports = router;