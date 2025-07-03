import React from 'react';
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import Pagination from '@material-ui/lab/Pagination';
const theme = createMuiTheme({
  palette: {
        type: 'dark',
  },
});
const Paginaion = (props) => {
    const handleChange = (page) => {
        props.setPage(page);
        window.scrollTo(0, 0);
    }
    return (
        <div style={{ width: "100%",display:"flex",justifyContent:"center" ,marginTop:'5px',color:'red'}}>
            <ThemeProvider theme={theme}>
                <Pagination onChange={(e)=>{handleChange(e.target.textContent)}} count={props.numOfPages} variant="outlined" hideNextButton hidePrevButton />
            </ThemeProvider>
        </div>
    )
}

export default Paginaion
