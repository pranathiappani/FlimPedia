import React from 'react';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import WhatshotIcon from '@material-ui/icons/Whatshot';
import LocalMoviesIcon from '@material-ui/icons/LocalMovies';
import TvIcon from '@material-ui/icons/Tv';
import { Link, useLocation } from "react-router-dom";

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#ff416c', // Modern pink-red brand accent color
    },
    text: {
      secondary: '#94a3b8', // Slate grey for inactive icons
    }
  },
});

const useStyles = makeStyles({
  root: {
    width: '100%',
    position: "fixed",
    bottom: 0,
    backgroundColor: "rgba(11, 15, 25, 0.85)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
    zIndex: 100,
    boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.4)",
    height: '64px',
  },
});

export default function LabelBottomNavigation() {
  const location = useLocation().pathname;
  let path = "Trending";
  if (location === "/movies") {
    path = "Movies";
  } else if (location === "/series") {
    path = "TV Series";
  }

  const classes = useStyles();
  const [value, setValue] = React.useState(path);

  React.useEffect(() => {
    setValue(path);
  }, [location, path]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <BottomNavigation value={value} onChange={handleChange} className={classes.root} showLabels>
        <BottomNavigationAction component={Link} to="/" label="Trending" value="Trending" icon={<WhatshotIcon />} />
        <BottomNavigationAction component={Link} to="/movies" label="Movies" value="Movies" icon={<LocalMoviesIcon />} />
        <BottomNavigationAction component={Link} to="/series" label="TV Series" value="TV Series" icon={<TvIcon />} />
      </BottomNavigation>
    </ThemeProvider>
  );
}
