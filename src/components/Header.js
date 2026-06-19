import React, { useState, useEffect } from 'react'
import './Header.css'
import MovieIcon from '@material-ui/icons/Movie';
import SearchIcon from '@material-ui/icons/Search';
import { useHistory } from 'react-router-dom';

const Header = () => {
  const [scroll, setScroll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const history = useHistory();

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      history.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(""); // clear input after search
    }
  };

  return (
    <div className={scroll ? "header active" : "header"}>
      <div className="header-brand" onClick={gototop} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <MovieIcon className="headerIcon" />
        <span className="headerText">FlimPedia</span>
      </div>
      
      <form className="header-search" onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder="Search movies & series..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">
          <SearchIcon />
        </button>
      </form>
    </div>
  )
}

export default Header
