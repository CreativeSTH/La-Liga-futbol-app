import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const LigaInfo = () => {
    const [league, setLeague] = useState(null);
    const [loading, setLoading] = useState(true); // Estado de carga
    const [error, setError] = useState(null); // Estado de error

    useEffect(() => {
        const getLigue = async () => {
            const url = 'https://api-football-v1.p.rapidapi.com/v3/leagues?id=140';
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY, // Usar variable de entorno
                    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
                }
            };
            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error('Error en la red');
                }
                const result = await response.json();
                setLeague(result);
            } catch (error) {
                setError(error.message); // Manejo de error
            } finally {
                setLoading(false); // Finaliza el estado de carga
            }
        };
        getLigue();
    }, []);

    if (loading) return (
        <div>
            <p>
                <Skeleton />
            </p>
            <p><Skeleton /></p>
        </div>
    ); // Mensaje de carga

    if (error) return <p>Error: {error}</p>; // Mensaje de error

    return (
        <div>
            <p>
                <img src={league.response[0].league.logo} alt={league.response[0].league.name} />
            </p>
            <p style={{ fontFamily: 'Oswald, sans-serif' }}>Temporada: 2024-2025</p>
        </div>
    );
};

export default LigaInfo;