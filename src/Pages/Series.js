import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Content from '../components/Content';
import Paginaion from '../components/Paginaion';
import Genres from "../components/Genres";
import useGenre from "../Hooks/useGenre";
import langData from "../languages";
import Languages from "../components/Languages";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

const Series = () => {
    window.scrollTo(0, 0);
    const [page, setPage] = useState(1);
    const [content, setContent] = useState([]);
    const [arrivingToday, setArrivingToday] = useState([]);
    const [onAir, setOnair] = useState([]);
    const [numPages, setNumpages] = useState();
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [genres, setGenres] = useState([]);
    const [lang, setLanguange] = useState("en");
    const genreForURL = useGenre(selectedGenres);
    const fetchArrivingTodaypage = async () => {
        const { data } = await axios.get(`https://api.themoviedb.org/3/tv/airing_today?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=${page}&with_genres=${genreForURL}&with_original_language=${lang}`)
        setArrivingToday(data.results);
    };
    const fetchonAir = async () => {
        const { data } = await axios.get(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=${page}&with_genres=${genreForURL}&with_original_language=${lang}`);
        setOnair(data.results);
    }
    const fetchMovies = async () => {
        const { data } = await axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=true&page=${page}&with_genres=${genreForURL}&with_original_language=${lang}`)
        setContent(data.results);
        setNumpages(data.total_pages)
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
    useEffect(() => {

    }, []);
    return (
        <div>

            <div className="page_title_language">
                <span className='pageTitle'>TV Series</span>
                <div className="languages">
                    <Languages
                        data={langData}
                        selected={lang}
                        handleAdd={setLang}
                    />
                </div>
            </div>
            <div className="genres_div">
                <Genres
                    type='tv'
                    selectedGenres={selectedGenres} genres={genres}
                    setSelectedGenres={setSelectedGenres} setGenres={setGenres}
                    setPage={setPage}
                />
            </div>
            {arrivingToday && (arrivingToday.length !== 0 && <span className='pageTitle'>Arriving Today
            <div className="series_navigation" ><NavigateBeforeIcon style={{ cursor: "pointer" }} onClick={() => document.getElementsByClassName("arrivingToday")[0].scrollLeft -= 800} fontSize="large" />
                    <NavigateNextIcon style={{ cursor: "pointer" }} onClick={(e) => {
                        e.target.display = "none";
                        document.getElementsByClassName("arrivingToday")[0].scrollLeft += 800
                    }}
                        fontSize="large" /></div></span>)}

            <div className="arrivingToday">
                {
                    arrivingToday && arrivingToday.map(e => {
                        return <div key={e.id} style={{ paddingRight: "15px" }}>
                            <Content contentfrom="arrivingToday"
                                key={e.id} id={e.id}
                                poster={e.poster_path}
                                title={e.title || e.name}
                                date={null} media="tv"
                                rating={null} />
                        </div>
                    })
                }
            </div>
            {onAir && (onAir.length !== 0 && <span className='pageTitle'>On TV
            <div className="series_navigation"><NavigateBeforeIcon onClick={() => { document.getElementsByClassName("arrivingToday")[1].scrollLeft -= 800 }} fontSize="large" />
                    <NavigateNextIcon onClick={() => {
                        document.getElementsByClassName("arrivingToday")[1].scrollLeft += 800
                    }} fontSize="large" />
                </div>
            </span>)}
            <div className="arrivingToday">
                {
                    onAir && onAir.map(e => {
                        return <div key={e.id} style={{ paddingRight: "15px" }}>
                            <Content key={e.id} id={e.id} poster={e.poster_path} title={e.title || e.name} date={null} media="tv" rating={null} /></div>
                    })
                }
            </div>
            {content && (content.length !== 0 && <span className='pageTitle'>Popular</span>)}
            <div className="trending" style={{ display: "flex", flexWrap: 'wrap', justifyContent: 'space-around' }}>
                {
                    content && content.map(e => {
                        return <Content key={e.id}
                            id={e.id}
                            poster={e.poster_path}
                            title={e.title || e.name}
                            date={e.release_date || e.first_air_date}
                            media="tv" rating={e.vote_average} />
                    })
                }
            </div>

            {
                numPages > 1 && <Paginaion setPage={setPage} numOfPages={numPages} />
            }
        </div>
    )
}

export default Series
