import './App.css';
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import { Container } from '@material-ui/core';
import Trending from "./Pages/Trending";
import Movies from "./Pages/Movies";
import Series from "./Pages/Series";
import Search from "./Pages/Search";
function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="app">
        <Container>
          <Switch>
            <Route path='/' component={Trending} exact />
            <Route path='/movies' component={Movies} exact />
            <Route path='/series' component={Series} exact />
            <Route path='/search' component={Search} />
          </Switch>
        </Container>
      </div>
      <Footer />

    </BrowserRouter>
  )
}

export default App;
