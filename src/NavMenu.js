import React from 'react';
import { Link } from 'react-router-dom'; 
import './NavMenu.css'; 

const NavMenu = ({ id }) => {
  const hasParam = id !== undefined && id !== null && id !== ''; 

  return (
    <nav className="nav-menu">
      <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
        <img src="/logo.stc.png" alt="Logo" className="logo-image" />
      </a>
      <div className='redes-hub'>
        <a href="https://www.linkedin.com/in/sebastianth/" target="_blank" rel="noopener noreferrer">
          <img src="/linkedin.png" alt="Logo LinkedIn" className="logo-redes" />
        </a>
        <a href="https://github.com/CreativeSTH" target="_blank" rel="noopener noreferrer">
          <img src="/github.svg" alt="Logo GitHub" className="logo-redes" />
        </a>
      </div>
      {hasParam && (
        <Link to="/" className="volver-link"> 
          Volver
        </Link>
      )}
    </nav>
  );
};

export default NavMenu;