import React, { useEffect, useState } from 'react';
import { API_URL, API_KEY, IMAGE_URL } from '../../Config';
import { Typography, Row } from 'antd';
import MainImage from './Sections/MainImage';

const { Title } = Typography;

function LandingPage() {

    // Create state for fetched data from Movie DB API to be stored inside
    const [Movies, setMovies] = useState([])

    useEffect(() => {
        // Get popular movies
        // Source: https://developers.themoviedb.org/3/movies/get-popular-movies
        fetch(`${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`)
            .then(response => response.json())
            .then(response => { 
                console.log(response)
                setMovies(response.results)
            })

    }, [])

    return (
        <div style={{ width:'100%', margin: 0 }}>
            {/* Movie Main Image Component */}
            {/* This means that when we get the movie information, we will render the MainImage component */}
            {Movies[1] && 
                <MainImage 
                    image={`${IMAGE_URL}w1280${Movies[1].backdrop_path && Movies[1].backdrop_path}`} 
                    title={Movies[1].original_title} 
                    text={Movies[1].overview}
                />
            }
            
            
            {/* Body */}
            <div style={{ width: '85%', margin: '1rem auto' }}>
                <Title level={2}>Latest Movies</Title>
                <hr/>

                {/* Grid Cards */}
                <Row gutter={[16,16]} >

                </Row>
                {/* Load More Button*/}
                <br/>
                <div style={{display:'flex', justifyContent:'center'}}>
                    <button onClick>Load More</button>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;