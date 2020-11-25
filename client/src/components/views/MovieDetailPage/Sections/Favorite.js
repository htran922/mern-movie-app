import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';


function Favorite(props) {

    const [FavoriteNumber, setFavoriteNumber] = useState(0);    // Set initial state to 0
    const [Favorited, setFavorited] = useState(false);          // Set initial state to false

    // Get values from parent component, MovieDetailPage so we bring the information as props
    const variable = {
        userFrom: props.userFrom,
        movieId: props.movieId,
        movieTitle: props.movieInfo.original_title,
        movieImage: props.movieInfo.backdrop_path,
        movieRuntime: props.movieInfo.runtime
    }

    const onClickFavorite = () => {
        if (Favorited) {
            // Movie already favorited (heart filled)
            axios.post('/api/favorite/removeFromFavorite', variable)
                .then(response => {
                    if(response.data.success) {
                        setFavoriteNumber(FavoriteNumber - 1)
                        setFavorited(!Favorited);
                    } else {
                        alert('Failed to add to favorite list')
                    }
                })
        } else {
            // Movie not yet favorited (heart outline)
            axios.post('/api/favorite/addToFavorite', variable)
                .then(response => {
                    if(response.data.success) {
                        // Increment from 0 to 1 and change from HeartOutline to HeartFilled
                        setFavoriteNumber(FavoriteNumber + 1)
                        setFavorited(!Favorited);
                    } else {
                        alert('Failed to remove from favorite list')
                    }
                })
        }
    }

    // Fetch number of how many people added this movie to their own favorite list
    useEffect(() => {
        axios.post('/api/favorite/favoriteNumber', variable) 
            .then (response => {
                if (response.data.success) {
                    setFavoriteNumber(response.data.favoriteNumber);
                } else {
                    alert ('Failed to get favoriteNumber')
                }
            })

        axios.post('/api/favorite/favorited', variable)
            .then(response => {
                if(response.data.success) {
                    setFavorited(response.data.favorited);
                } else {
                    alert('Failed to get if user favorited this movie')
                }
            })
    })

    return (
        <Button onClick={onClickFavorite}>{Favorited ? <HeartFilled/> : <HeartOutlined/>} {FavoriteNumber}</Button>

    );
}

export default Favorite;