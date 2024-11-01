import React, { useState, useEffect } from 'react';
import './Teams.css'; 
import Skeleton from 'react-loading-skeleton'; 
import 'react-loading-skeleton/dist/skeleton.css'; 
import { useTrail, animated } from 'react-spring';
import { useNavigate } from 'react-router-dom';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [leagueId, setLeagueId] = useState(140); // Id de la liga
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error
  const navigate = useNavigate(); // Inicializar useNavigate

  useEffect(() => {
    const getTeams = async () => {
      const url = `https://api-football-v1.p.rapidapi.com/v3/teams?league=${leagueId}&season=2024`;
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
          'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        }
      };
        try {
          const response = await fetch(url, options);
          if (!response.ok) {
            throw new Error('Error en la red');
          }
          const result = await response.json();
          //console.log(result);
          setTeams(result.response); // Almacena los equipos
        } catch (error) {
          setError(error.message); // Manejo de error
        } finally {
          setLoading(false); // Finaliza el estado de carga
        }
    };
    getTeams();
  }, [leagueId]);

  // Configuración de useTrail
  const trail = useTrail(teams.length, {
    opacity: 1,
    x: 0,
    from: { opacity: 0, x: 20 },
    config: { mass: 5, tension: 2000, friction: 200 },
  });

  if (loading) return (
    <div className="teams-grid">
      <Skeleton count={3} height={150} /> {/* Muestra un esqueleto mientras carga */}
      <Skeleton count={3} height={150} /> {/* Muestra un esqueleto mientras carga */}
      <Skeleton count={3} height={150} /> {/* Muestra un esqueleto mientras carga */}
      <Skeleton count={3} height={150} /> {/* Muestra un esqueleto mientras carga */}
    </div>
  ); // Mensaje de carga

  if (error) return <p>Error: {error}</p>; // Mensaje de error

  // Función para manejar el clic en el equipo
  const handleTeamClick = (id) => {
    const encodedId = btoa(id); // Codificar el id en base64
    navigate(`/team/${encodedId}`); // Redirigir a la ruta del equipo
  };

  return (
    <div className="teams-grid">
      {trail.map((style, index) => (
        <animated.div 
          key={teams[index].team.id} 
          style={{
            ...style,
            transform: style.x.to(x => `translateX(${x}px)`) // Mantener el efecto de animación
          }} 
          className="team-card"
          onClick={() => handleTeamClick(teams[index].team.id)} // Agregar evento onClick
        >
          <p><img src={teams[index].team.logo} alt={teams[index].team.name} /></p>
          <strong className='team-title'>{teams[index].team.name}</strong>
          <p className='stadium'>{teams[index].venue.name}</p>
        </animated.div>
      ))}
    </div>
  );
};

export default Teams;