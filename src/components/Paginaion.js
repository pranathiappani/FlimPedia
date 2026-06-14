import React from 'react';
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import Pagination from '@material-ui/lab/Pagination';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#ff416c', // Brand color for active page
    },
    text: {
      primary: '#cbd5e1',
    }
  },
});

const Paginaion = (props) => {
    const handleChange = (page) => {
        if (page) {
            props.setPage(page);
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
    return (
        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: '30px', marginBottom: '10px' }}>
            <ThemeProvider theme={theme}>
                <Pagination 
                    onChange={(e, val) => handleChange(val)} 
                    count={props.numOfPages} 
                    variant="outlined" 
                    shape="rounded"
                    color="primary"
                />
            </ThemeProvider>
        </div>
    )
}

export default Paginaion
