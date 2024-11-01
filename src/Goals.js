import React from 'react';
import { useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import useTeamStatistics from './useTeamStatistics'; // Importa el hook
import './Goals.css'

const Goals = () => {
    const { id } = useParams(); // Obtener el ID del equipo de la URL
    const decodedId = atob(id); // Decodificar el id
    const { statistics, error, loading } = useTeamStatistics(decodedId); // Usa el hook

    // Renderizado
    if (loading) {
        return <Skeleton count={3} height={30} />;
    }

    if (error) {
        return <p>{error}</p>;
    }

    // Extraer el total de goles a favor y en contra
    const totalGolesAFavor = statistics.goals.for?.total?.total || 0; 
    const totalGolesEnContra = statistics.goals.against?.total?.total || 0; 

    return (
        <div className="text-center p-3 border-round-sm bg-secondary font-bold">
            <h5 className='fixture-title'>GOLES</h5>
            <div className='cards-text'>Goles a Favor: <div className='badge-primary background-primary'>{totalGolesAFavor}</div></div>
            <div className='cards-text'>Goles en Contra: <div className='badge-primary background-bordered secundary-color'>{totalGolesEnContra}</div></div>
        </div>
    );
};

export default Goals;