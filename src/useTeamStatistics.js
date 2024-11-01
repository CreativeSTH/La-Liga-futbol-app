import { useState, useEffect } from 'react';

// Mapa de caché para almacenar estadísticas de equipos
const statisticsCache = new Map();

const useTeamStatistics = (decodedId) => {
    const [statistics, setStatistics] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar si ya tenemos datos en caché
        if (statisticsCache.has(decodedId)) {
            const cachedData = statisticsCache.get(decodedId);
            setStatistics(cachedData);
            setLoading(false);
            return; // No hacer la llamada a la API si ya hay datos en caché
        }

        const getTeamStatistics = async () => {
            const url = `https://api-football-v1.p.rapidapi.com/v3/teams/statistics?league=140&season=2024&team=${decodedId}`;
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
                    throw new Error('Error en la respuesta de la API al obtener las estadísticas');
                }
                const result = await response.json();
                console.log(result);
                setStatistics(result.response); // Almacena la información del equipo
                statisticsCache.set(decodedId, result.response); // Almacena en caché
            } catch (error) {
                console.error(error);
                setError('No se pudieron cargar las estadísticas del equipo.'); // Manejo de errores
            } finally {
                setLoading(false); // Cambiar el estado de carga
            }
        };

        getTeamStatistics();
    }, [decodedId]);

    return { statistics, error, loading };
};

export default useTeamStatistics;