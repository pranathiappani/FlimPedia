import React from 'react'
import { img_300, unavailable } from '../config/config'
import './Content.css';
import Rating from '@material-ui/lab/Rating';
import ContentModel from "./ContentModel"


const Content = ({ id, poster, title, date, media, rating }) => {
    return (
        <ContentModel media={media} id={id}>

            <div className="img_div"><img className='poster' src={poster ? `${img_300}/${poster}` : unavailable} alt={title} /></div>
            <div className="title_div"><b className='title'>{title}</b></div>
            <div className='subTitle'>{media === 'tv' ? "TV Series" : "Movie"}</div>
            <div className='subTitle'>{date}</div>
            {rating > 0 && <Rating name="half-rating-read" defaultValue={rating / 2} precision={0.1} readOnly />}

        </ContentModel>
    )
}

export default Content
