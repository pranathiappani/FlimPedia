import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Content from '../components/Content';
import Paginaion from '../components/Paginaion';
import Genres from "../components/Genres";
import useGenre from "../Hooks/useGenre";
import langData from "../languages";
import Languages from "../components/Languages"
const Movies = () => {
    window.scrollTo(0, 0);
    const [page, setPage] = useState(1);
    const [content, setContent] = useState([]);
    const [numPages, setNumpages] = useState();
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [genres, setGenres] = useState([]);
    const [lang, setLanguange] = useState("en");
    const genreForURL = useGenre(selectedGenres);

    const fetchMovies = async () => {
        const date = new Date().toISOString();
        const { data } = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=release_date.desc&include_adult=true&include_video=true&page=${page}&with_genres=${genreForURL}&with_original_language=${lang}&release_date.lte=${date}`)
        setContent(data.results);
        setNumpages(data.total_pages)
    };
    useEffect(() => {
        fetchMovies()
        // eslint-disable-next-line
    }, [page, genreForURL, lang]);
    const setLang = (e) => {
        setPage(1)
        setLanguange(e.alpha2)
    }
    return (
        <div>
            <div className="page_title_language">
                <span className='pageTitle'>Movies</span>
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
                    type='movie'
                    selectedGenres={selectedGenres} genres={genres}
                    setSelectedGenres={setSelectedGenres} setGenres={setGenres}
                    setPage={setPage}
                />
            </div>
            <div className="trending" style={{ display: "flex", flexWrap: 'wrap', justifyContent: 'space-around' }}>
                {
                    content && content.map(e => {
                        return <Content key={e.id} id={e.id} poster={e.poster_path} title={e.title || e.name} date={e.release_date || e.first_air_date} media='movie' rating={e.vote_average} />
                    })
                }
            </div>
            {
                numPages > 1 && <Paginaion setPage={setPage} numOfPages={numPages} />
            }
        </div>
    )
}

export default Movies
