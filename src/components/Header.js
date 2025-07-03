import React, { useState } from 'react'
import './Header.css'

const Header = () => {
  const [scroll, setScroll] = useState(false);
  const gototop = () => {
    window.scroll(0, 0);
  };
  const change = () => {
    window.scrollY >= 50 ? setScroll(true) : setScroll(false)
  };
  window.addEventListener('scroll', change)
  return (
    <span onClick={gototop} className={scroll ? "header active" : "header"}>filmflix</span>
  )
}

export default Header
