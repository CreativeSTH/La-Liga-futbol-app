import React from 'react';
import { useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import useTeamStatistics from './useTeamStatistics'; // Importa el hook
import './Lineups.css';

const Lineups = () => {
  const { id } = useParams(); // Obtener el ID del equipo de la URL
  const decodedId = atob(id); // Decodificar el id
  const { statistics, error, loading } = useTeamStatistics(decodedId); // Usa el hook

  // Función para obtener la alineación más utilizada
  const getMostUsedFormation = (lineups) => {
    if (!lineups || lineups.length === 0) return null;

    return lineups.reduce((prev, current) => {
      return (prev.played > current.played) ? prev : current;
    });
  };

  if (loading) {
    return (
    <div>
        <Skeleton count={3} height={150} />
    </div>
    );
}

  if (error) {
    return <p>{error}</p>;
  }

  const totalPartidosJugados = statistics.lineups.reduce((acumulado, alineacion) => acumulado + alineacion.played, 0);

  const mostUsedFormation = getMostUsedFormation(statistics.lineups);

  const porcentajePartidosJugados = `${mostUsedFormation.played} de ${totalPartidosJugados}`;

  return (
    <div>
      {mostUsedFormation ? (
        <div className="text-center p-3 border-round-sm bg-primary font-bold flex flex-column gap-2">
          <h5 className='fixture-title'>ALINEACIÓN</h5>
          <div className='lineup-title'> <div className='lineup-badge'>{mostUsedFormation.formation}</div></div>
          <div className='lineup-text'>Con esta Alineación <br></br>{porcentajePartidosJugados} Partidos</div>
        </div>
      ) : (
        <p>No hay alineaciones disponibles.</p>
      )}
    </div>
  );
};

export default Lineups;