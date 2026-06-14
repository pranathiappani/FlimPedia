import { Button, createMuiTheme, Tab, Tabs, TextField, ThemeProvider } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Content from '../components/Content';
import SearchIcon from "@material-ui/icons/Search";
import Paginaion from '../components/Paginaion';
import axios from 'axios';

const searchContainerStyle = {
    display: "flex",
    margin: "20px 0",
    width: '100%',
    gap: '10px'
}

const Search = () => {
    window.scrollTo(0, 0);
    const [type, setType] = useState(0);
    const [page, setPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [content, setContent] = useState([]);
    const [numPages, setNumPages] = useState(0);

    const theme = createMuiTheme({
        palette: {
            type: "dark",
            primary: {
                main: "#ff416c" // Brand color for active highlights
            },
            secondary: {
                main: "#6366f1"
            }
        }
    });

    const fetchSearch = async () => {
        if (!searchText) {
            setContent([]);
            setNumPages(0);
            return;
        }
        try {
            const { data } = await axios.get(
                `https://api.themoviedb.org/3/search/${type ? "tv" : "movie"}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&query=${searchText}&page=${page}&include_adult=false`
            );
            setContent(data.results || []);
            setNumPages(data.total_pages || 0);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchSearch();
        // eslint-disable-next-line
    }, [type, page]);

    const handelSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        fetchSearch();
    }

    return (
        <div>
            <ThemeProvider theme={theme}>
                <form onSubmit={handelSubmit}>
                    <div style={searchContainerStyle}>
                        <TextField 
                            onChange={e => setSearchText(e.target.value)} 
                            style={{ flex: 1 }} 
                            className="searchBox" 
                            label="Search movies or TV shows..." 
                            variant="outlined"
                            size="small"
                        />
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary"
                            style={{ minWidth: '54px', borderRadius: '8px' }}
                        >
                            <SearchIcon />
                        </Button>
                    </div>
                </form>
                <Tabs 
                    onChange={(e, ne) => {
                        setType(ne);
                        setPage(1);
                    }} 
                    value={type} 
                    indicatorColor="primary" 
                    textColor='primary'
                    style={{ marginBottom: '20px' }}
                    variant="fullWidth"
                >
                    <Tab style={{ fontWeight: '600' }} label="Movies" />
                    <Tab style={{ fontWeight: '600' }} label="TV Series" />
                </Tabs>
            </ThemeProvider>
            <div className="trending" style={{ display: "flex", flexWrap: 'wrap', justifyContent: 'space-around' }}>
                {
                    content && content.map(e => {
                        return <Content key={e.id} id={e.id} poster={e.poster_path} title={e.title || e.name} date={e.release_date || e.first_air_date} media={type ? "tv" : "movie"} rating={e.vote_average} />
                    })
                }
                {searchText && content.length === 0 && (
                    <div style={{ padding: '40px 0', textAlign: 'center', width: '100%' }}>
                        <h3 style={{ color: '#94a3b8', fontWeight: '500' }}>No {type ? "TV Series" : "Movies"} Found</h3>
                    </div>
                )}
            </div>
            {
                numPages > 1 && <Paginaion setPage={setPage} numOfPages={numPages} />
            }
        </div>
    )
}

export default Search
