import React, { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import NavMenu from './NavMenu';
//import Lineups from './Lineups'; //Trabajando en estos modulos
//import Cards from './Cards'; //Trabajando en estos modulos
//import Goals from './Goals'; //Trabajando en estos modulos
//import Form from './Form'; //Trabajando en estos modulos
import TeamPlayers from './TeamPlayers';
import { useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './TeamDetail.css';

const TeamDetail = () => {
  const { id } = useParams(); // Obtener el ID del equipo de la URL
  const decodedId = atob(id); // Decodificar el id
  const [team, setTeam] = useState(null);
  
  const [fixtures, setFixtures] = useState(null);
  const [error, setError] = useState(null); // Estado para manejar errores
  const [fixtureOdds, setFixtureOdds] = useState(null);
  const [isVisible, setIsVisible] = useState(false); // Estado para logo animation

  useEffect(() => {
    const getTeamDetails = async () => {
      const url = `https://api-football-v1.p.rapidapi.com/v3/teams?id=${decodedId}`;
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
          throw new Error('Error en la respuesta de la API al obtener los equipos');
        }
        const result = await response.json();
        setTeam(result.response[0]); // Almacena la información del equipo
      } catch (error) {
        //console.error(error);
        setError('No se pudieron cargar los detalles del equipo.'); // Manejo de errores
      }
    };
    const getTeamFixtures = async () => {
      const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?season=2024&team=${decodedId}`;
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
          throw new Error('Error en la respuesta de la API al obtener los resultados');
        }
        const result = await response.json();
        setFixtures(result.response); // Almacena la información de los partidos
      } catch (error) {
        //console.error(error);
        setError('No se pudieron cargar los partidos del equipo.'); // Manejo de errores
      }
    };

    getTeamDetails();
    getTeamFixtures();
  }, [decodedId]);

  // Filtrar partidos jugados y no jugados
  const playedFixtures = fixtures ? fixtures.filter(fixture => new Date(fixture.fixture.date) < new Date()) : [];
  const upcomingFixtures = fixtures ? fixtures.filter(fixture => new Date(fixture.fixture.date) >= new Date()) : [];
  const nextFixture = upcomingFixtures[0];

  useEffect(() => {
    const geFixtureOdds = async () => {
      if (!nextFixture) return;
      const fixtureId = nextFixture.fixture.id;
      const url = `https://api-football-v1.p.rapidapi.com/v3/odds?fixture=${fixtureId}&bookmaker=8`; 
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
          throw new Error('Error en la respuesta de la API al obtener las cuotas');
        }
        const result = await response.json();
        //console.log(result)
        setFixtureOdds(result.response[0]); // Almacena la información de las cuotas
      } catch (error) {
        //console.error(error);
        setError('No se pudieron cargar las cuotas del partido.'); // Manejo de errores
      }
    };

    geFixtureOdds();
  }, [nextFixture]); // Dependencia en nextFixture
  
  // Animación de logo
  const logoProps = useSpring({
    transform: isVisible ? 'scale(1)' : 'scale(0)',
    opacity: isVisible ? 1 : 0,
    config: { tension: 600, friction: 5 }
  });
  
  // Animación de componentes
  const fadeProps = useSpring({
    opacity: team && fixtures ? 1 : 0,
    transform: team && fixtures ? 'translateY(0)' : 'translateY(-20px)',
    config: { tension: 200, friction: 20 }
  });
  
  // Animación de fondo
  const props = useSpring({
    from: { backgroundColor: 'white' },
    to: [
      { backgroundColor: '#f7f7f7' },
      { backgroundColor: 'white' }
    ],
    config: { duration: 1000 },
    reset: true,
    loop: true
  });

  if (error) return <p>{error}</p>; // Mostrar mensaje de error
 
  // Mostrar la animación mientras se cargan los datos
  const loadingAnimation = (
    <animated.div style={{ ...props, height: '100vh', width: '100%', position: 'absolute', top: 0, left: 0 }}>
      <div className='animation-canva'>
        <img
          className='animation-logo'
          src='/ll.png'
          alt='Logo'
        />
      </div>
    </animated.div>
  );

  if (!team || !fixtures) return loadingAnimation;

  // Ordenar partidos por fecha en descendente
  playedFixtures.sort((a, b) => new Date(b.fixture.date) - new Date(a.fixture.date));
  upcomingFixtures.sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));

  return (
    <animated.div style={fadeProps}>
      <NavMenu id={id} />
      <div>
        <div className='grid'>
          {/* Logo y Nombre del Team */}
          <div className='col-12 sm:col-12 md:col-6  lg:col-2'>
            <article className='fixture-card shadow-1 flex flex-column justify-content-center align-items-center h-9rem'>
              <img className='fixture-logo-team' src={team.team.logo} alt={`Logo de ${team.team.name}`} />
              <h2 className='fixture-title'>{team.team.name}</h2>
            </article>
          </div>
           {/* Proximo Partido y cuotas */}
           <div className='col-12 lg:col-2 md:col-6 sm:col-12'>
            <article className='fixture-card shadow-1 flex flex-column justify-content-center align-items-center h-9rem'>
                {fixtureOdds && nextFixture ? (
                  <div className="flex flex-column justify-content-center align-items-center  gap-2">
                    <h5 className='fixture-title'>PRÓXIMO PARTIDO</h5>
                    {nextFixture ? (
                          <div className='fixture-date'>
                            {new Date(nextFixture.fixture.date).toLocaleDateString()} - {new Date(nextFixture.fixture.date).toLocaleTimeString()}
                          </div>
                      ) : (
                        <p>No hay partidos programados.</p>
                      )}
                    {fixtureOdds.bookmakers.map(bookmaker => (
                      bookmaker.bets.map(bet => {
                        if (bet.name === "Match Winner") {
                          let valuelocal, valueempate, valuevisita;

                          bet.values.forEach(value => {
                            if (value.value === 'Home') {
                              valuelocal = value.odd; // Guardar la cuota de Local
                            } else if (value.value === 'Draw') {
                              valueempate = value.odd; // Guardar la cuota de Empate
                            } else if (value.value === 'Away') {
                              valuevisita = value.odd; // Guardar la cuota de Visita
                            }
                          });
    
                          return (
                            <div key={bet.id}>
                              <div className='flex flex-row gap-3'>
                                <div className='flex flex-column justify-content-center gap-2'>
                                  <img className="next-fixture-logo" src={nextFixture.teams.home.logo} alt={nextFixture.teams.home.name} />
                                  <span className='odds odds-home'>{valuelocal}</span>
                                </div>
                                <div className='flex flex-column gap-2'>
                                  <span>VS</span>
                                  <span className='odds odds-draw'>{valueempate}</span>
                                </div>
                                <div className='flex flex-column gap-2'>
                                  <img className="next-fixture-logo" src={nextFixture.teams.away.logo} alt={nextFixture.teams.away.name} />
                                  <span className='odds odds-visit'>{valuevisita}</span>
                                </div>
                              </div>
                              <div className='odds-tittle'>
                                  Cuotas 
                                </div>
                            </div>
                          );
                        }
                        return null; // Para evitar errores si no hay coincidencia
                      })
                    ))}
                  </div>
                ) : (
                  <p>No hay cuotas disponibles.</p>
                )}
            </article>
          </div>
          {/* Jugadores */}
          <div className='col-12 lg:col-8 md:col-12 sm:col-12'>
            <article className='flex flex-column justify-content-center align-items-center h-9rem overflow-hidden'>
              <TeamPlayers/>
            </article>
          </div>
        </div>
        <h4 className='fixture-title mt-4'>HISTORIAL DE PARTIDOS</h4>
        {playedFixtures.length > 0 ? (
          <div className="calendar-grid">
            {playedFixtures.map((fixture) => (
              <div key={fixture.fixture.id} className='calendar-day'>
                <div className="fixture-card">
                  <p>
                    <span className='fixture-scored'>{fixture.goals.home}</span> - <span className='fixture-scored'>{fixture.goals.away}</span>
                  </p>
                  <p>
                    <img className="fixture-logo" src={fixture.teams.home.logo} alt={fixture.teams.home.name} />
                    vs
                    <img className="fixture-logo" src={fixture.teams.away.logo} alt={fixture.teams.away.name} />
                  </p>
                  <p className='fixture-date'>
                    {new Date(fixture.fixture.date).toLocaleDateString()} - {new Date(fixture.fixture.date).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay partidos jugados.</p>
        )}
      </div>
    </animated.div>
  );
};

export default TeamDetail;