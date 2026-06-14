import React from 'react'
import { img_300, unavailable } from '../config/config'
import './Content.css';
import ContentModel from "./ContentModel"

const Content = ({ id, poster, title, date, media, rating }) => {
    const year = date ? date.substring(0, 4) : 'N/A';

    return (
        <ContentModel media={media} id={id}>
            <div className="card_container">
                <div className="img_div">
                    <img className='poster' src={poster ? `${img_300}/${poster}` : unavailable} alt={title} />
                    {rating > 0 && (
                        <div className="card_rating_badge">
                            <span>⭐</span>
                            <span className="rating_value">{rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>
                <div className="card_content">
                    <b className='title' title={title}>{title}</b>
                    <div className='card_metadata'>
                        <span className='media_type'>{media === 'tv' ? "TV Series" : "Movie"}</span>
                        <span className='separator'>•</span>
                        <span className='release_year'>{year}</span>
                    </div>
                </div>
            </div>
        </ContentModel>
    )
}

export default Content
