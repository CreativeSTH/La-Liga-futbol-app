import React, { useEffect, useState } from 'react';
import './LastFixture.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const LastFixture = () => {
  const [fixtures, setFixtures] = useState([]);
  const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?league=140&season=2024`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
      'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
    }
  };

  useEffect(() => {
    fetch(url, options)
      .then(response => response.json())
      .then(data => {
        const today = new Date();
        const pastResults = data.response.filter(result => {
          const resultDate = new Date(result.fixture.date);
          return resultDate <= today;
        });

        const lastMatches = {};
        const teamIds = new Set();

        pastResults.forEach(result => {
          const homeTeamId = result.teams.home.id;
          const awayTeamId = result.teams.away.id;

          if (!lastMatches[homeTeamId] || new Date(result.fixture.date) > new Date(lastMatches[homeTeamId].fixture.date)) {
            lastMatches[homeTeamId] = result;
          }

          if (!lastMatches[awayTeamId] || new Date(result.fixture.date) > new Date(lastMatches[awayTeamId].fixture.date)) {
            lastMatches[awayTeamId] = result;
          }
        });

        const uniqueMatches = Object.values(lastMatches).filter(fixture => {
          const homeTeamId = fixture.teams.home.id;
          const awayTeamId = fixture.teams.away.id;

          if (!teamIds.has(homeTeamId) && !teamIds.has(awayTeamId)) {
            teamIds.add(homeTeamId);
            teamIds.add(awayTeamId);
            return true;
          }
          return false;
        });

        setFixtures(uniqueMatches);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="slider-container">
      {fixtures.length > 0 ? (
        <div className='slide-shadow'>
            <div className="slider">
            {fixtures.map((fixture, idx) => (
                <div className="slide" key={idx}>
                <img src={fixture.teams.home.logo} alt={`${fixture.teams.home.name} logo`} width="30" height="30" />
                {' '} {fixture.goals.home} {' '}
                vs {' '}
                {' '} {fixture.goals.away} 
                <img src={fixture.teams.away.logo} alt={`${fixture.teams.away.name} logo`} width="30" height="30" />
                </div>
            ))}
            </div>
        </div>
      ) : (
        <div>
            <p>
                <Skeleton />
            </p>
            <p><Skeleton /></p>
        </div>
      )}
    </div>
  );
};

export default LastFixture;