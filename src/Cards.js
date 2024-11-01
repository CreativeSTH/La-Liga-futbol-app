import React from 'react';
import { useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import useTeamStatistics from './useTeamStatistics'; // Importa el hook
import './Cards.css';

const Cards = () => {
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

    // Extraer el total de tarjetas rojas y amarillas
    const totalTarjetasRojas = statistics.cards.red ? Object.values(statistics.cards.red).reduce((acc, curr) => acc + (curr.total || 0), 0) : 0;
    const totalTarjetasAmarillas = statistics.cards.yellow ? Object.values(statistics.cards.yellow).reduce((acc, curr) => acc + (curr.total || 0), 0) : 0;

    return (
        <div className="text-center p-3 border-round-sm bg-primary font-bold flex flex-column gap-2">
            <h5 className='fixture-title'>TARJETAS </h5>
            <div className='cards-text'>Rojas: <div className='badge-primary background-primary'>{totalTarjetasRojas}</div></div>
            <div className='cards-text'>Amarillas: <div className='badge-primary bg-yellow secundary-color'>{totalTarjetasAmarillas}</div></div>
        </div>
    );
};

export default Cards;