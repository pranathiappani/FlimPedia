import React, { useState, useEffect } from 'react';
import axios from "axios"
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { img_500, img_300, unavailableLandscape } from "../config/config";
import Button from '@material-ui/core/Button';
import YouTubeIcon from '@material-ui/icons/YouTube';
import "./contentModel.css"
import Carousel from "./Caurasol";
import Rating from '@material-ui/lab/Rating';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
  },
  paper: {
    width: "90%",
    height: "85%",
    backgroundColor: "#1e293b", // Slate 800
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    color: "#f8fafc",
    boxShadow: theme.shadows[10],
    padding: theme.spacing(2, 2, 4),
    outline: 'none',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    [theme.breakpoints.up('md')]: {
      width: "80%",
      height: "80%",
      padding: theme.spacing(3, 4),
    }
  },
}));

export default function ContentModel({ children, media, id }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState();
  const [video, setVideo] = useState();
  const [providers, setProviders] = useState();
  const [loading, setLoading] = useState(true)

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchData = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media}/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    setContent(data);
  };

  const fetchProviders = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media}/${id}/watch/providers?api_key=${process.env.REACT_APP_API_KEY}`
    );
    setProviders(data.results?.IN);
  }

  const fetchVideo = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media}/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    setVideo(data.results[0]?.key);
    setLoading(false)
  };

  useEffect(() => {
    fetchData();
    fetchVideo();
    fetchProviders();
    // eslint-disable-next-line
  }, []);

  const releaseYear = content ? (content.release_date || content.first_air_date || '----').substring(0, 4) : '';

  return (
    <>
      {
        loading ? (
          <div className="media">
            <CircularProgress size="1.5rem" style={{ color: "#818cf8", margin: 'auto' }} />
          </div>
        ) : (
          <div className="media" type="button" onClick={handleOpen}>
            {children}
          </div>
        )
      }
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          {content && <div className={classes.paper}>
            <div className="contentModel" >
              <img className="content_img" alt={content.name || content.title} src={content.poster_path ? `${img_500}/${content.poster_path}` : unavailableLandscape} />
              <img className="content_img_landscape" alt={content.name || content.title} src={content.backdrop_path ? `${img_500}/${content.backdrop_path}` : unavailableLandscape} />

              <div className="contentModel_about">
                <span className="content_title">
                  {content.name || content.title}
                  <span className="content_title_year"> ({releaseYear})</span>
                </span>
                
                {content.tagline && <i className="content_tagline">"{content.tagline}"</i>}
                
                {
                  content.vote_average > 0 && <div className="contentModel_rating">
                    <p className="rating_label">Rating:</p>
                    <Rating name="half-rating-read" defaultValue={content.vote_average / 2} precision={0.1} readOnly size="small" /> 
                    <p className="rating_score">{content.vote_average.toFixed(1)}/10</p>
                  </div>
                }

                <div className="content_providers">
                  {((providers && providers.flatrate) || (content.networks && content.networks[0])) && (
                    <span className="providers_title">Available On</span>
                  )}
                  <div className="content_providers_img">
                    {
                      providers && providers.flatrate && providers.flatrate.slice(0, 3).map((provider) => (
                        <div key={provider.provider_id} className="provider_logo" title={provider.provider_name}>
                          <img alt={provider.provider_name} src={`${img_300}/${provider.logo_path}`} />
                        </div>
                      ))
                    }
                    {
                      content && content.networks && content.networks.slice(0, 2).map((network) => (
                        <div key={network.id} className="provider_logo network_logo" title={network.name}>
                          <img alt={network.name} src={`${img_300}/${network.logo_path}`} />
                        </div>
                      ))
                    }
                  </div>
                </div>

                <div className="genres">
                  {
                    content.genres.map(g => {
                      return <Chip size="small" key={g.id} style={{ color: '#cbd5e1', backgroundColor: '#334155', border: '1px solid rgba(255, 255, 255, 0.05)', margin: '3px' }} label={g.name} />
                    })
                  }
                </div>

                {
                  content.overview && (
                    <div className="description_container">
                      <span className="content_dscription">{content.overview}</span>
                    </div>
                  )
                }

                <div className="cast_carousel_container">
                  <Carousel media={media} id={id} />
                </div>
                
                {video && (
                  <Button 
                    style={{ 
                      background: 'linear-gradient(45deg, #ef4444 0%, #dc2626 100%)', 
                      color: "#ffffff", 
                      fontWeight: "bold",
                      borderRadius: "8px",
                      padding: "8px 20px",
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontSize: '13px',
                      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                      alignSelf: 'flex-start',
                    }} 
                    className="trailer_button"
                    variant="contained" 
                    startIcon={<YouTubeIcon />} 
                    target="_blank" 
                    href={`https://www.youtube.com/watch?v=${video}`}
                  >
                    Watch Trailer
                  </Button>
                )}
              </div>
            </div>
          </div>}
        </Fade>
      </Modal>
    </>
  );
}
