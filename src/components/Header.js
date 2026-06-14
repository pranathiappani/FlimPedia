import React, { useState, useEffect } from 'react'
import './Header.css'
import MovieIcon from '@material-ui/icons/Movie';

const Header = () => {
  const [scroll, setScroll] = useState(false);

  const gototop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const change = () => {
      window.scrollY >= 50 ? setScroll(true) : setScroll(false);
    };
    window.addEventListener('scroll', change);
    return () => {
      window.removeEventListener('scroll', change);
    };
  }, []);

  return (
    <div onClick={gototop} className={scroll ? "header active" : "header"}>
      <MovieIcon className="headerIcon" />
      <span className="headerText">FlimPedia</span>
    </div>
  )
}

export default Header
