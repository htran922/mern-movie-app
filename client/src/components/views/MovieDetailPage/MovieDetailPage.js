import React, { useEffect, useState } from 'react';
import { API_URL, API_KEY, IMAGE_URL } from '../../Config';
import { Descriptions, Button, Row } from 'antd';
import MainImage from '../LandingPage/Sections/MainImage';
import GridCard from '../LandingPage/Sections/GridCard';
import Favorite from './Sections/Favorite';

function MovieDetailPage(props) {

    const [Movie, setMovie] = useState([]);
    const [Crews, setCrews] = useState([]);
    const [ActorToggle, setActorToggle] = useState([]);

    const movieId = props.match.params.movieId;

    useEffect(() => {
        // Fetch single movie
        fetch(`${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`)
            .then( response => response.json() )
            .then( response => {
                setMovie(response)

                // Fetch movie crew information
                fetch(`${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`)
                    .then( response => response.json() )
                    .then( response => {
                        setCrews(response.cast);
                    })
            })
    });

    const handleClick = () => {
        setActorToggle(!ActorToggle)
    }
    return (
        <div>
            {/* Main Image */}
            {Movie && 
                <MainImage 
                    image={`${IMAGE_URL}w1280${Movie.backdrop_path && Movie.backdrop_path}`} 
                    title={Movie.original_title} 
                    text={Movie.overview}
                />
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
                <Descriptions title="Movie Info" bordered>
                    <Descriptions.Item label="Title">{Movie.original_title}</Descriptions.Item>
                    <Descriptions.Item label="Release Date">{Movie.release_date}</Descriptions.Item>
                    <Descriptions.Item label="Revenue">${Movie.revenue}</Descriptions.Item>
                    <Descriptions.Item label="Runtime (min)">{Movie.runtime}</Descriptions.Item>
                    <Descriptions.Item label="Average Rating" span={2}>{Movie.vote_average}</Descriptions.Item>
                    <Descriptions.Item label="Number of Voters">{Movie.vote_count}</Descriptions.Item>
                    <Descriptions.Item label="Status">{Movie.status}</Descriptions.Item>
                    <Descriptions.Item label="Popularity">{Movie.popularity}</Descriptions.Item>
                </Descriptions>

                {/* Toggle Actor Button */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={handleClick}>View Actors</Button>
                </div>

                {/* Grid Cards for Crew Members */}
                {!ActorToggle &&
                    <Row gutter={[16,16]} >
                        {Crews && Crews.map((crew, index) => (
                            <React.Fragment key={index}>

                                {/* Only return images for cast members with available images */}
                                {crew.profile_path &&
                                    <GridCard
                                        actor
                                        image={`${IMAGE_URL}w500${crew.profile_path}`}
                                    />
                                }
                                
                            </React.Fragment>
                        ))}
                    </Row>
                
                }
                

            </div>
        </div>
    );
}

export default MovieDetailPage;