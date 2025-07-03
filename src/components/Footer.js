import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import WhatshotIcon from '@material-ui/icons/Whatshot';
import LocalMoviesIcon from '@material-ui/icons/LocalMovies';
import TvIcon from '@material-ui/icons/Tv';
import SearchIcon from '@material-ui/icons/Search';
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
const useStyles = makeStyles({
  root: {
    width: '100vw',
    position: "fixed",
    bottom: 0,
    backgroundColor: "#181818",
    zIndex: 10,
  },
});
const styles = {
  color: '#ffffff'
}

export default function LabelBottomNavigation() {
  let path = "home";
  const location = useLocation().pathname;
  if (location === "/") {
    path = "Trending";
  } else if (location === "/movies") {
    path = "Movies"
  } else if (location === "/series") {
    path = "TV Series"
  } else {
    path = "Search"
  }

  const classes = useStyles();
  const [value, setValue] = React.useState(path);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation value={value} onChange={handleChange} className={classes.root} >
      <BottomNavigationAction component={Link} to="/" style={styles} label="Trending" value="Trending" icon={<WhatshotIcon />} />
      <BottomNavigationAction component={Link} to="/movies" style={styles} label="Movies" value="Movies" icon={<LocalMoviesIcon />} />
      <BottomNavigationAction component={Link} to="/series" style={styles} label="TV Series" value="TV Series" icon={<TvIcon />} />
      <BottomNavigationAction component={Link} to="/search" style={styles} label="Search" value="Search" icon={<SearchIcon />} />
    </BottomNavigation>
  );
}
