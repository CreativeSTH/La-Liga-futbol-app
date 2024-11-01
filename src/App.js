import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import LigaInfo from './LigaInfo';
import Teams from './Teams';
import NavMenu from './NavMenu';
import TeamDetail from './TeamDetail';
import LastFixture from './LastFixture';
import 'primeflex/primeflex.css';
import './App.css';

// Componente contenedor para la ruta principal
const Home = () => (
  <>
    <NavMenu />
    <LigaInfo />
    <LastFixture />
    <Teams />
  </>
);

function App() {
  const [loading, setLoading] = useState(true);

  // Efecto para manejar el tiempo de carga
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1 segundo

    return () => clearTimeout(timer); // Limpiar el temporizador
  }, []);

  // Animación para el preloader
  const loadingProps = useSpring({ opacity: loading ? 1 : 0 });
  const logoProps = useSpring({
    to: [
      { transform: 'translateY(0px)' },
      { transform: 'translateY(-10px)' },
      { transform: 'translateY(0px)' },
    ],
    from: { transform: 'translateY(0px)' },
    config: { duration: 1000, tension: 200, friction: 10 },
    reset: true,
    loop: true,
  });

  const loadingAnimation = (
    <animated.div style={{ ...loadingProps, height: '100vh', width: '100%', position: 'absolute', top: 0, left: 0 }}>
      <div className='animation-canva'>
        <animated.img
          className='animation-logo'
          src='/ll.png'
          alt='Logo'
          style={logoProps}
        />
      </div>
    </animated.div>
  );

  return (
    <Router>
      <div className='App'>
        {loading ? loadingAnimation : (
          <Routes>
            <Route path="/" element={<Home />} /> {/* Ruta principal que muestra LigaInfo y Teams */}
            <Route path="/team/:id" element={<TeamDetail />} /> {/* Ruta para el detalle del equipo */}
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;