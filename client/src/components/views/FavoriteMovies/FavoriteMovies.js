import React, { useEffect, useState } from 'react';
import './Favorite.css'
import axios from 'axios';
import { Button, Popover } from 'antd';
import { IMAGE_URL } from "../../Config"

function FavoriteMovies(props) {

    const variable = {
        userFrom: localStorage.getItem('userId')
    }

    const [ FavoriteMovies, setFavoriteMovies] = useState([]);

    useEffect(() => {
        fetchFavoriteMovies();
    })

    const fetchFavoriteMovies = () => {
        axios.post('/api/favorite/getFavoriteMovies', variable)     
            .then(response => {
                if (response.data.success) {
                    // Store favorite movies information inside state
                    setFavoriteMovies(response.data.myFavoriteMovies);
                } else {
                    alert("Failed to get favorite movies")
                }
            })
            .catch(err => { console.log(err) })   
    }

    const onClickRemove = (movieId) => {

        const info = {
            movieId: movieId,
            userFrom: localStorage.getItem('userId')

        }
        axios.post('/api/favorite/removeFromFavorite', info)
            .then (response => {
                if (response.data.success) {
                    // We want to retrigger the fetch api for getting favorite movies
                    fetchFavoriteMovies();
                }
            })
    }

    // Map favorite movies information into table
    const renderTableBody = FavoriteMovies.map((movie, index) => {
        console.log(movie);
        const content = (
            <div>
                {/* {movie.movieImage ? 
                    <img src={`${IMAGE_URL}w500${movieImage}`} alt="movie image"/>    
                    :
                    "image unavailable"
                } */}
            </div>
        )

        return (
            <tr key={index}>
                <Popover content={content} title={movie.movieTitle}>
                    <td>{movie.movieTitle}</td>
                </Popover>
                <td>{movie.movieRuntime}</td>
                <td><Button onClick={() => onClickRemove(movie.movieId)}>Remove</Button></td>
            </tr>
        )
    })

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <h3>My Favorite Movies</h3>
            <hr/>
            <table>
                <thead>
                    <tr>
                        <th>Movie Title</th>
                        <th>Runtime (minutes)</th>
                        <th>Remove from Favorites</th>
                    </tr>
                </thead>
                <tbody>
                    {renderTableBody}
                </tbody>
            </table>
        </div>
    );
}

export default FavoriteMovies;