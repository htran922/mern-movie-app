import React, { useEffect, useState } from 'react';
import { Button, Popover, Typography } from 'antd';
import axios from 'axios';
import './Favorite.css';
import { useSelector } from 'react-redux';
import { IMAGE_URL } from "../../Config";

const { Title } = Typography;

function FavoriteMovies() {
    const user = useSelector(state => state.user)
    
    const [ FavoriteMovies, setFavoriteMovies ] = useState([]);
    const [ LoadingFavoriteMovies, setLoadingFavoriteMovies ] = useState(true);
    let variable = { userFrom: localStorage.getItem('userId') }

    useEffect(() => {
        fetchFavoriteMovies();
    })

    const fetchFavoriteMovies = () => {
        axios.post('/api/favorite/getFavoriteMovies', variable)     
            .then(response => {
                if (response.data.success) {
                    // Store favorite movies information inside state
                    setFavoriteMovies(response.data.myFavoriteMovies);
                    setLoadingFavoriteMovies(false);
                } else {
                    alert("Failed to get favorite movies")
                }
            }) 
    }

    const onClickRemove = (movieId, userFrom) => {

        const info = {
            movieId: movieId,
            userFrom: userFrom

        }

        axios.post('/api/favorite/removeFromFavorite', info)
            .then (response => {
                if (response.data.success) {
                    // We want to retrigger the fetch api for getting favorite movies
                    fetchFavoriteMovies();
                } else {
                    alert("Failed to remove from favorite movies list");
                }
            })
    }

    // Map favorite movies information into table
    const renderGridCards = FavoriteMovies.map((movie, index) => {
        const content = (
            <div>
                { movie.movieImage ? 
                    <img src={`${IMAGE_URL}w500${movie.movieImage}`} alt={`${movie.movieTitle}`}/>
                    :
                    "Movie image unavailable" 
                }
            </div>
        )

        return (
            <tr key={index}>
                <Popover content={content} title={`${movie.movieTitle}`}>
                    <td>{movie.movieTitle}</td>
                </Popover>
                <td>{movie.movieRuntime}</td>
                <td><Button onClick={() => onClickRemove(movie.movieId, movie.userFrom)}>Remove</Button></td>
            </tr>
        )
    })

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2}>My Favorite Movies</Title>
            <hr/>
            {
                user.userData && !user.userData.isAuth ?
                <div style={{ width: '100%', fontSize: '2rem', height: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <p>Please Log in first...</p>
                    <a href="/login">Go to Login page</a>
                </div> :

                !LoadingFavoriteMovies && 
                <table>
                    <thead>
                        <tr>
                            <th>Movie Title</th>
                            <th>Runtime (minutes)</th>
                            <th>Remove from Favorites</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderGridCards}
                    </tbody>
                </table>
            }
        
        </div>
    )
}

export default FavoriteMovies;