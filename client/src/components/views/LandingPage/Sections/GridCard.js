import React from 'react';
import { Col } from 'antd';


function GridCard(props) {

    if (props.actor) {
        return (
            <Col lg={6} md={8} s={16} xs={24} >
                <div style={{ position: 'relative'}}>
                   <img style={{ width: '100%', height: '320px' }} alt="actor profile" src={props.image} />
                </div>
            </Col>
        )
    } else {
         return (
            <Col lg={6} md={8} s={16} xs={24} >
                <div style={{ position: 'relative'}}>
                    <a href={`/movie/${props.movieId}`}>
                        <img style={{ width: '100%', height: '320px' }} alt="movie poster" src={props.image} />
                    </a>
                </div>
            </Col>
        );
    }
    
}

export default GridCard;