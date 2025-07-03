import { Button, createMuiTheme, Tab, Tabs, TextField, ThemeProvider } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Content from '../components/Content';
import SearchIcon from "@material-ui/icons/Search";
import Paginaion from '../components/Paginaion';

import axios from 'axios';
const style = {
    display: "flex",
    margin: "15px 0",
    width: '100%',
    padding: '0 0 0 5px'
}
const Search = () => {
    window.scrollTo(0, 0);
    const [type, setType] = useState(0);
    const [page, setPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [content, setContent] = useState();
    const [numPages, setNumPages] = useState();
    const theme = createMuiTheme({
        palette: {
            type: "dark",
            primary: {
                main: "#ffffff"
            }
        }
    });

    const fetchSearch = async () => {
        try {
            const { data } = await axios.get(
                `https://api.themoviedb.org/3/search/${type ? "tv" : "movie"}?api_key=${process.env.REACT_APP_API_KEY
                }&language=en-US&query=${searchText}&page=${page}&include_adult=false`
            );
            setContent(data.results);
            setNumPages(data.total_pages);
            // console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        window.scroll(0, 0);
        fetchSearch();
        // eslint-disable-next-line
    }, [type, page, searchText])

    const handelSubmit = (e) => {
        fetchSearch();
        e.preventDefault();
    }
    return (
        <div >
            <ThemeProvider theme={theme}>
                <form onSubmit={handelSubmit}>
                    <div style={style}><TextField onChange={e => setSearchText(e.target.value)} style={{ flex: 1 }} className="searchBox" label="Search" />
                        <Button type="submit"><SearchIcon /></Button>
                    </div>
                </form>
                <Tabs onChange={(e, ne) => setType(ne)} value={type} indicatorColor="primary" textColor='primary'>
                    <Tab style={{ width: "50%" }} label="Search Movies" />
                    <Tab style={{ width: "50%" }} label="Search TV Series " />
                </Tabs>
            </ThemeProvider>
            <div className="trending" style={{ display: "flex", flexWrap: 'wrap', justifyContent: 'space-around' }}>
                {
                    content && content.map(e => {
                        return <Content key={e.id} id={e.id} poster={e.poster_path} title={e.title || e.name} date={e.release_date || e.first_air_date} media={type ? "tv" : "movie"} rating={e.vote_average} />
                    })
                }
                {searchText &&
                    !content &&
                    (type ? <h2>No Series Found</h2> : <h2>No Movies Found</h2>)}
            </div>
            {
                numPages > 1 && <Paginaion setPage={setPage} numOfPages={numPages} />
            }
        </div>
    )
}

export default Search
