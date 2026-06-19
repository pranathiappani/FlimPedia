import axios from 'axios';
import React, { useEffect } from 'react';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0.5),
    minWidth: 150,
  },
  select: {
    borderRadius: '8px',
    backgroundColor: 'rgba(15, 23, 42, 0.3)',
    fontSize: '13px',
    fontWeight: '500',
    color: '#cbd5e1',
    fontFamily: 'Montserrat, sans-serif',
    '&:hover': {
      backgroundColor: 'rgba(15, 23, 42, 0.45)',
    },
  },
}));

const Genres = ({
    type,
    label,
    selectedGenres,
    setSelectedGenres,
    genres,
    setGenres,
    setPage
}) => {
    const classes = useStyles();

    const handleAdd = (event) => {
        const genreId = event.target.value;
        if (!genreId) return;
        
        const genre = genres.find((g) => g.id === genreId);
        if (genre) {
            setSelectedGenres([...selectedGenres, genre]);
            setGenres(genres.filter((g) => g.id !== genre.id));
            setPage(1);
        }
    };

    const handleRemove = (genre) => {
        setSelectedGenres(
            selectedGenres.filter((selected) => selected.id !== genre.id)
        );
        setGenres([...genres, genre]);
        setPage(1);
    };

    const handleClearAll = () => {
        setGenres([...genres, ...selectedGenres]);
        setSelectedGenres([]);
        setPage(1);
    };

    const fetchGenres = async () => {
        const { data } = await axios.get(
            `https://api.themoviedb.org/3/genre/${type}/list?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
        );
        const fetchedGenres = data.genres || [];
        const filtered = fetchedGenres.filter(
            (fg) => !selectedGenres.some((sg) => sg.id === fg.id)
        );
        setGenres(filtered);
    };

    useEffect(() => {
        fetchGenres();
        return () => {
            setGenres([]);
        };
        // eslint-disable-next-line
    }, [type]);

    return (
        <div className="genres_wrapper_div">
            <div className="genres_header_row">
                {label && <span className="filter_label">{label}</span>}
                <FormControl variant="outlined" size="small" className={`${classes.formControl} filter_select_form`}>
                    <Select
                        value=""
                        onChange={handleAdd}
                        displayEmpty
                        className={classes.select}
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    backgroundColor: '#1e293b',
                                    color: '#cbd5e1',
                                    maxHeight: 250,
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    borderRadius: '8px',
                                },
                            },
                        }}
                    >
                        <MenuItem value="" disabled style={{ fontSize: '13px', fontFamily: 'Montserrat, sans-serif' }}>
                            Add Genre...
                        </MenuItem>
                        {genres && Array.isArray(genres) &&
                            genres.map((e) => (
                                <MenuItem 
                                    key={e.id} 
                                    value={e.id} 
                                    style={{ fontSize: '13px', fontFamily: 'Montserrat, sans-serif' }}
                                >
                                    {e.name}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
                
                {selectedGenres && selectedGenres.length > 0 && (
                    <span 
                        onClick={handleClearAll}
                        style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            color: '#ff416c',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '0.8px',
                            userSelect: 'none',
                        }}
                        className="clear_genres_btn"
                    >
                        Clear All
                    </span>
                )}
            </div>

            {selectedGenres && selectedGenres.length > 0 && (
                <div className="selected_genres_chips">
                    {selectedGenres.map(e => (
                        <Chip 
                            size="small" 
                            key={e.id} 
                            style={{ 
                                color: '#ffffff', 
                                backgroundColor: '#ff416c', 
                                fontSize: "12px", 
                                fontWeight: "600",
                                border: '1px solid #ff416c',
                                boxShadow: '0 4px 10px rgba(255, 65, 108, 0.2)'
                            }} 
                            clickable 
                            onDelete={() => handleRemove(e)} 
                            label={e.name} 
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Genres;
