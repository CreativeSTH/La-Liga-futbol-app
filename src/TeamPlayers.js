import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './TeamPlayers.css';

const TeamPlayers = () => {
  const { id } = useParams();
  const decodedId = atob(id);
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const slideWidth = 300; // Ajuste del ancho del slider según sea necesario

  const positionTranslations = {
    Defender: 'Defensor',
    Goalkeeper: 'Portero',
    Attacker: 'Delantero',
    Midfielder: 'Volante',
  };

  const fetchPlayers = async (page) => {
    const url = `https://api-football-v1.p.rapidapi.com/v3/players?team=${decodedId}&season=2024&page=${page}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
      },
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Error en la respuesta de la API');
      }
      const result = await response.json();
      return result;
    } catch (error) {
      setError('No se pudieron cargar los detalles del equipo.');
      return null;
    }
  };

  useEffect(() => {
    const getTeamPlayers = async () => {
      setLoading(true);
      const initialResult = await fetchPlayers(1);
      if (initialResult && initialResult.paging) {
        const totalPages = initialResult.paging.total;
        const allPlayers = [];

        for (let page = 1; page <= totalPages; page++) {
          const result = await fetchPlayers(page);
          if (result && result.response) {
            allPlayers.push(...result.response);
          }
        }

        setPlayers(allPlayers);
        setLoading(false);
        setError(null);
      } else {
        setPlayers([]);
        setLoading(false);
        setError('No se encontraron jugadores para el equipo seleccionado.');
      }
    };

    getTeamPlayers();
  }, [decodedId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (players.length > 0) {
        setOffset((prevOffset) => (prevOffset + 1) % (players.length * slideWidth));
      }
    }, 20); // Ajuste de la velocidad del slider

    return () => clearInterval(interval);
  }, [players]);

  const props = useSpring({
    transform: `translateX(-${offset}px)`,
    config: { tension: 100, friction: 10 },
  });

  return (
    <div className="team-players">
      {error && <div className="error">Error: {error}</div>}
      {loading ? (
        <div>
          <p><Skeleton /></p>
          <p><Skeleton /></p>
        </div>
      ) : (
        <div className="carousel-container">
          <h4 className='fixture-title mb-3 mt-3 players-tittle'>PLANTILLA</h4>
          <animated.div className="carousel" style={props}>
            {players.map((player) => (
              <div className="player-card" key={player.player.id}>
                <div className="player-info">
                  <img
                    src={player.player.photo}
                    alt={player.player.name}
                    className="player-photo"
                  />
                </div>
                <div className="player-details">
                  <div className='player-name'>{player.player.name} <div>Edad: {player.player.age}</div></div>
                  <div className='player-position'>
                    {positionTranslations[player.statistics[0].games.position] || player.statistics[0].games.position}
                  </div>
                </div>
              </div>
            ))}
            {/* Repetimos los jugadores para crear el efecto infinito */}
            {players.map((player) => (
              <div className="player-card shadow-1" key={`copy-${player.player.id}`}>
                <div className="player-info">
                  <img
                    src={player.player.photo}
                    alt={player.player.name}
                    className="player-photo"
                  />
                </div>
                <div className="player-details">
                  <div className='player-name'>{player.player.name} <div className='player-position'>Edad: {player.player.age}</div></div>
                  <div className='player-position'>
                    {positionTranslations[player.statistics[0].games.position] || player.statistics[0].games.position}
                  </div>
                </div>
              </div>
            ))}
          </animated.div>
        </div>
      )}
    </div>
  );
};

export default TeamPlayers;