import React, { useEffect, useState } from "react";
import axios from "axios";

import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { img_300, noPicture } from "../config/config";
const handleDragStart = (e) => e.preventDefault();

const imgStyle = {
  borderRadius: "10px",
  marginBottom: "5px",
  boxShadow: '0px 0px 5px black',
  maxHeight: "300px",
  maxWidth: "100px"
}
const carouselItem = {
  display: "flex",
  flexDirection: "column",
  objectFit: "contain",
  padding: "10px"
}

const Carousel = ({ media, id }) => {
  const [credits, setCredits] = useState([]);

  const items = credits.map((c) => (
    <div style={carouselItem} className="carouselItem">
      <img style={imgStyle}
        src={c.profile_path ? `${img_300}/${c.profile_path}` : noPicture}
        alt={c?.name}
        onDragStart={handleDragStart}
        className="carouselItem__img"
      />
      <b className="carouselItem__txt">{c?.name}</b>
    </div>
  ));

  const responsive = {
    0: {
      items: 3,
    },
    512: {
      items: 5,
    },
    1024: {
      items: 7,
    },
  };

  const fetchCredits = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media}/${id}/credits?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    setCredits(data.cast);
  };

  useEffect(() => {
    fetchCredits();
    // eslint-disable-next-line
  }, []);

  return (
    <AliceCarousel style={{ color: 'red' }} mouseTracking
      autoPlay
      autoPlayInterval={1000}
      disableDotsControls
      disableButtonsControls
      responsive={responsive}
      items={items}
    />
  );
};

export default Carousel;