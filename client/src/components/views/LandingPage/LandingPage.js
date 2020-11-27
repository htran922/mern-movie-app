import React, { useEffect, useState, useRef } from 'react';
import { API_URL, API_KEY, IMAGE_URL } from '../../Config';
import { Typography, Row } from 'antd';
import MainImage from './Sections/MainImage';
import GridCard from '../../shared/GridCard';

const { Title } = Typography;

function LandingPage() {

    const buttonRef = useRef(null);

    // Create state for fetched data from Movie DB API to be stored inside
    const [Movies, setMovies] = useState([]);
    const [MainMovieImage, setMainMovieImage] = useState(null);
    const [Loading, setLoading] = useState(true);
    // Set the current page state to be 0 at the start
    const [CurrentPage, setCurrentPage] = useState(0); 

    useEffect(() => {
        // The first time we load the page we want to only load the first page
        const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
        fetchMovies(endpoint)
    },[])

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
    },[])

    const fetchMovies = (path) => {
        // Get popular movies
        // Source: https://developers.themoviedb.org/3/movies/get-popular-movies
        fetch(path)
            .then(result => result.json())
            .then(result => { 

                // Could also use concat() here instead of spread operator
                setMovies([...Movies, ...result.results])
                setMainMovieImage(MainMovieImage || result.results[0])
                setCurrentPage(result.page)
            }, setLoading(false))
            .catch(error => console.log('Error:', error))
    }

    const loadMoreItems = () => {
        let endpoint = '';
        setLoading(true)
        console.log('CurrentPage', CurrentPage)
        endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${CurrentPage + 1}`;
        fetchMovies(endpoint);

    }

    const handleScroll = () => {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight - 1) {

            // loadMoreItems()
           
            buttonRef.current.click();
            console.log('clicked')
        }
    }

    return (
        <div style={{ width:'100%', margin: 0 }}>
            {/* Movie Main Image Component */}
            {/* Need to do this because React render speed is faster than fetching movie images */}
            {MainMovieImage && 
                <MainImage 
                    image={`${IMAGE_URL}w1280${MainMovieImage.backdrop_path}`} 
                    title={MainMovieImage.original_title} 
                    text={MainMovieImage.overview}
                />
            }
            
            {/* Body */}
            <div style={{ width: '85%', margin: '1rem auto' }}>
                <Title level={2}>Latest Movies</Title>
                <hr/>

                {/* Grid Cards */}
                <Row gutter={[16,16]} >
                    {Movies && Movies.map((movie, index) => (
                        <React.Fragment key={index}>
                            <GridCard
                                // To handle render method being faster than fetching movie poster
                                image={movie.poster_path ? 
                                    `${IMAGE_URL}w500${movie.poster_path}` 
                                    : null}
                                movieId={movie.id}
                                movieName={movie.original_title}
                            />
                        </React.Fragment>
                    ))}
                </Row>
                {/* Load More Button*/}

                {Loading && 
                    <div>Loading...</div>
                }
                <br/>
                <div style={{display:'flex', justifyContent:'center'}}>
                    <button ref={buttonRef} onClick={loadMoreItems} className="loadMore" >Load More</button>
                </div>
            </div>
        </div>
    );
}

export default LandingPage

// import React, { useEffect, useState, useRef } from 'react'
// import { Typography, Row, Button } from 'antd';
// import { API_URL, API_KEY, IMAGE_URL, IMAGE_SIZE, POSTER_SIZE } from '../../Config'
// import MainImage from './Sections/MainImage'
// import GridCard from '../../shared/GridCard'
// const { Title } = Typography;
// function LandingPage() {
//     const buttonRef = useRef(null);

//     const [Movies, setMovies] = useState([])
//     const [MainMovieImage, setMainMovieImage] = useState(null)
//     const [Loading, setLoading] = useState(true)
//     const [CurrentPage, setCurrentPage] = useState(0)

//     useEffect(() => {
//         const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
//         fetchMovies(endpoint)
//     }, [])

//     useEffect(() => {
//         window.addEventListener("scroll", handleScroll);
//     }, [])


//     const fetchMovies = (endpoint) => {

//         fetch(endpoint)
//             .then(result => result.json())
//             .then(result => {
//                 // console.log(result)
//                 // console.log('Movies',...Movies)
//                 // console.log('result',...result.results)
//                 setMovies([...Movies, ...result.results])
//                 setMainMovieImage(MainMovieImage || result.results[0])
//                 setCurrentPage(result.page)
//             }, setLoading(false))
//             .catch(error => console.error('Error:', error)
//             )
//     }

//     const loadMoreItems = () => {
//         let endpoint = '';
//         setLoading(true)
//         console.log('CurrentPage', CurrentPage)
//         endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${CurrentPage + 1}`;
//         fetchMovies(endpoint);

//     }

//     const handleScroll = () => {
//         const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
//         const body = document.body;
//         const html = document.documentElement;
//         const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
//         const windowBottom = windowHeight + window.pageYOffset;
//         if (windowBottom >= docHeight - 1) {

//             // loadMoreItems()
//             console.log('clicked')
//             buttonRef.current.click();

//         }
//     }

//     return (
//         <div style={{ width: '100%', margin: '0' }}>
//             {MainMovieImage &&
//                 <MainImage
//                     image={`${IMAGE_URL}${IMAGE_SIZE}${MainMovieImage.backdrop_path}`}
//                     title={MainMovieImage.original_title}
//                     text={MainMovieImage.overview}
//                 />

//             }

//             {/* Body */}
//             <div style={{ width: '85%', margin: '1rem auto' }}>

//                 <Title level={2} > Movies by latest </Title>
//                 <hr />
//                 <Row gutter={[16, 16]}>
//                     {Movies && Movies.map((movie, index) => (
//                         <React.Fragment key={index}>
//                             <GridCard
//                                 image={movie.poster_path ?
//                                     `${IMAGE_URL}${POSTER_SIZE}${movie.poster_path}`
//                                     : null}
//                                 movieId={movie.id}
//                                 movieName={movie.original_title}
//                             />
//                         </React.Fragment>
//                     ))}
//                 </Row>

//                 {Loading &&
//                     <div>Loading...</div>}

//                 <br />
//                 <div style={{ display: 'flex', justifyContent: 'center' }}>
//                     <button ref={buttonRef} className="loadMore" onClick={loadMoreItems}>Load More</button>
//                 </div>
//             </div>

//         </div>
//     )
// }

// export default LandingPage
