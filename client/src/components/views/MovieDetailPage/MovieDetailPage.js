import React, { useEffect, useState } from 'react';
import { API_URL, API_KEY, IMAGE_URL } from '../../Config';
import { Button, Row } from 'antd';
import MainImage from '../LandingPage/Sections/MainImage';
import GridCard from '../../shared/GridCard';
import Favorite from './Sections/Favorite';
import MovieInfo from './Sections/MovieInfo';

function MovieDetailPage(props) {

    const movieId = props.match.params.movieId;

    const [Movie, setMovie] = useState([]);
    const [Cast, setCast] = useState([]);
    const [LoadingForMovie, setLoadingForMovie] = useState(true);
    const [LoadingForCast, setLoadingForCast] = useState(true);
    const [ActorToggle, setActorToggle] = useState(false);

    useEffect(() => {
        // Fetch single movie
        let endpointMovieInfo = `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`;
        fetchMovieInfo(endpointMovieInfo);

    });

    const toggleActorView = () => {
        setActorToggle(!ActorToggle)
    }

    const fetchMovieInfo = (endpoint) => {
        fetch(endpoint)
        .then( response => response.json() )
        .then( response => {
            setMovie(response);
            setLoadingForMovie(false);
            // Fetch movie cast information
            let endpointCastInfo = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
            fetch(endpointCastInfo)
                .then( response => response.json() )
                .then( response => {
                    setCast(response.cast);
                })
            setLoadingForCast(false)
        })
        .catch(error => console.error('Error: ', error))
    }
    
    return (
        <div>
            {/* Main Image */}
            {!LoadingForMovie ? 
                <MainImage 
                    image={`${IMAGE_URL}w1280${Movie.backdrop_path && Movie.backdrop_path}`} 
                    title={Movie.original_title} 
                    text={Movie.overview}
                />
                :
                <div>Loading Main Image...</div>
            }

            {/* Body */}
            <div style={{ width: '85%', margin: '1rem auto' }}>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Favorite 
                        userFrom={localStorage.getItem('userId')}
                        movieId={movieId}
                        movieInfo={Movie}           // Will allow for access to movie title, image and runtime
                    />
                </div>


                {/* Movie Info Table */}
                {!LoadingForMovie ?
                    <MovieInfo movie={Movie} />
                    :
                    <div>Loading Movies...</div>
                }
              
                <br/>

                {/* Toggle Actor Button */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={toggleActorView}>View Actors</Button>
                </div>

                <br/>

                {/* Grid Cards for Crew Members */}
                {ActorToggle &&
                    <Row gutter={[16,16]} >
                        {
                            !LoadingForCast ? Cast.map((person, index) => (
                                person.profile_path &&
                                <GridCard actor image={person.profile_path} characterName={person.characterName} />
                            ))
                            :
                            <div>Loading Cast...</div>
                        }
                    </Row>
                }
            </div>
        </div>
    );
}

export default MovieDetailPage;