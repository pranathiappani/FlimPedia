import axios from 'axios'
import React, { useState, useEffect, useRef } from 'react'
import Content from '../components/Content';
import Paginaion from '../components/Paginaion';
import Genres from "../components/Genres";
import useGenre from "../Hooks/useGenre";
import langData from "../languages";
import Languages from "../components/Languages";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#6366f1',
    },
  },
});

const Series = () => {
    window.scrollTo(0, 0);
    const [page, setPage] = useState(1);
    const [content, setContent] = useState([]);
    const [arrivingToday, setArrivingToday] = useState([]);
    const [onAir, setOnair] = useState([]);
    const [numPages, setNumpages] = useState(0);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [genres, setGenres] = useState([]);
    const [lang, setLanguange] = useState("en");
    const genreForURL = useGenre(selectedGenres);

    const arrivingTodayRef = useRef(null);
    const onAirRef = useRef(null);

    const scrollArriving = (direction) => {
        if (arrivingTodayRef.current) {
            arrivingTodayRef.current.scrollLeft += direction === 'left' ? -600 : 600;
        }
    };

    const scrollOnAir = (direction) => {
        if (onAirRef.current) {
            onAirRef.current.scrollLeft += direction === 'left' ? -600 : 600;
        }
    };

    const fetchArrivingTodaypage = async () => {
        try {
            const { data } = await axios.get(`https://api.themoviedb.org/3/tv/airing_today?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=${page}&with_genres=${genreForURL}&with_original_language=${lang}`)
            setArrivingToday(data.results || []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchonAir = async () => {
        try {
            const { data } = await axios.get(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=${page}&with_genres=${genreForURL}&with_original_language=${lang}`);
            setOnair(data.results || []);
        } catch (error) {
            console.error(error);
        }
    }

    const fetchMovies = async () => {
        try {
            const { data } = await axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=true&page=${page}&with_genres=${genreForURL}&with_original_language=${lang}`)
            setContent(data.results || []);
            setNumpages(data.total_pages || 0);
        } catch (error) {
            console.error(error);
        }
    };

    const setLang = (e) => {
        setPage(1)
        setLanguange(e.alpha2)
    }

    useEffect(() => {
        fetchMovies();
        fetchArrivingTodaypage();
        fetchonAir();
        // eslint-disable-next-line
    }, [page, genreForURL, lang]);

    return (
        <div>
            <div className="pageTitle">
                <span>TV Series</span>
            </div>
            
            <ThemeProvider theme={theme}>
                <div className="filter_panel">
                    <div className="filter_row">
                        <div className="filter_group">
                            <span className="filter_label">Language</span>
                            <div className="languages">
                                <Languages
                                    data={langData}
                                    selected={lang}
                                    handleAdd={setLang}
                                />
                            </div>
                        </div>
                        <Genres
                            type='tv'
                            label="Genres"
                            selectedGenres={selectedGenres} 
                            genres={genres}
                            setSelectedGenres={setSelectedGenres} 
                            setGenres={setGenres}
                            setPage={setPage}
                        />
                    </div>
                </div>
            </ThemeProvider>
            
            {arrivingToday && arrivingToday.length > 0 && (
                <div>
                    <div className="pageTitle">
                        <span>Arriving Today</span>
                        <div className="series_navigation">
                            <NavigateBeforeIcon style={{ cursor: "pointer" }} onClick={() => scrollArriving('left')} />
                            <NavigateNextIcon style={{ cursor: "pointer" }} onClick={() => scrollArriving('right')} />
                        </div>
                    </div>
                    <div className="arrivingToday" ref={arrivingTodayRef}>
                        {
                            arrivingToday.map(e => {
                                return (
                                    <div key={e.id} style={{ paddingRight: "5px" }}>
                                        <Content 
                                            contentfrom="arrivingToday"
                                            key={e.id} 
                                            id={e.id}
                                            poster={e.poster_path}
                                            title={e.title || e.name}
                                            date={null} 
                                            media="tv"
                                            rating={e.vote_average} 
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            )}

            {onAir && onAir.length > 0 && (
                <div>
                    <div className="pageTitle">
                        <span>On TV</span>
                        <div className="series_navigation">
                            <NavigateBeforeIcon style={{ cursor: "pointer" }} onClick={() => scrollOnAir('left')} />
                            <NavigateNextIcon style={{ cursor: "pointer" }} onClick={() => scrollOnAir('right')} />
                        </div>
                    </div>
                    <div className="arrivingToday" ref={onAirRef}>
                        {
                            onAir.map(e => {
                                return (
                                    <div key={e.id} style={{ paddingRight: "5px" }}>
                                        <Content 
                                            key={e.id} 
                                            id={e.id} 
                                            poster={e.poster_path} 
                                            title={e.title || e.name} 
                                            date={null} 
                                            media="tv" 
                                            rating={e.vote_average} 
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            )}

            {content && content.length > 0 && (
                <div>
                    <div className="pageTitle">
                        <span>Popular</span>
                    </div>
                    <div className="trending" style={{ display: "flex", flexWrap: 'wrap', justifyContent: 'space-around' }}>
                        {
                            content.map(e => {
                                return (
                                    <Content 
                                        key={e.id}
                                        id={e.id}
                                        poster={e.poster_path}
                                        title={e.title || e.name}
                                        date={e.release_date || e.first_air_date}
                                        media="tv" 
                                        rating={e.vote_average} 
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            )}

            {
                numPages > 1 && <Paginaion setPage={setPage} numOfPages={numPages} />
            }
        </div>
    )
}

export default Series
