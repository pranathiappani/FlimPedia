import axios from 'axios'
import React, { useEffect } from 'react';
import Chip from '@material-ui/core/Chip';


const Genres = ({
    type,
    selectedGenres,
    setSelectedGenres,
    genres,
    setGenres,
    setPage
}) => {
    const handleAdd = (genre) => {
        setSelectedGenres([...selectedGenres, genre]);
        setGenres(genres.filter((g) => g.id !== genre.id));
        setPage(1);
    };

    const handleRemove = (genre) => {
        setSelectedGenres(
            selectedGenres.filter((selected) => selected.id !== genre.id)
        );
        setGenres([...genres, genre]);
        setPage(1);
    };

    const fetchGenres = async () => {
        const { data } = await axios.get(
            `https://api.themoviedb.org/3/genre/${type}/list?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
        );
        setGenres(data.genres);
    };

    useEffect(() => {
        fetchGenres();

        return () => {
            setGenres({}); // unmounting
        };
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            {selectedGenres &&
                selectedGenres.map(e => <Chip size="medium" key={e.id} style={{ color: '#ffffff', backgroundColor: '#bb86fc', margin: '2px', fontSize: "15px", fontWeight: "bold" }} clickable onClick={() => handleRemove(e)} label={e.name} variant="outlined" />)}
            {genres &&
                genres.map(e => <Chip key={e.id} style={{ color: '#ffffff', backgroundColor: '#282c34', margin: '2px', fontSize: "15px", fontWeight: "bold" }} clickable onClick={() => handleAdd(e)} label={e.name} variant="outlined" />)}
        </div>
    )
}

export default Genres
