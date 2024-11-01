import React from 'react';
import { useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import useTeamStatistics from './useTeamStatistics'; // Importa el hook
import './Form.css';

const Form = () => {
    const { id } = useParams(); // Obtener el ID del equipo de la URL
    const decodedId = atob(id); // Decodificar el id
    const { statistics, error, loading } = useTeamStatistics(decodedId); // Usa el hook

    // Renderizado
    if (loading) {
        return (
        <div>
            <p><Skeleton /></p>
        </div>
        );
    }

    if (error) {
        return <p>{error}</p>;
    }

    // Verificar si statistics y statistics.form están definidos
    if (!statistics || !statistics.form) {
        return <p>No se encontraron datos de formación.</p>;
    }

    // Obtener el string de form
    const formString = statistics.form; // Acceso directo a form
    const formArray = formString.split('').slice(0, 4); // Dividir en caracteres y tomar los primeros 4

    return (
        <div className="text-center p-3 border-round-sm bg-secondary font-bold flex flex-column gap-2">
            <h5 className='fixture-title'>PERFORMANCE</h5>
            <div>
            {formArray.map((char, index) => {
                // Cambiar 'W' por 'V', 'L' por 'D' y 'D' por 'E'
                const displayChar = char === 'W' ? 'V' : char === 'L' ? 'D' : char === 'D' ? 'E' : char;

                // Asignar clases según el carácter
                const className = char === 'W' ? 'badge-green' : char === 'L' ? 'badge-red' : char === 'D' ? 'badge-gray' : '';

                return (
                    <span 
                        key={index} 
                        className={className}
                    >
                        {displayChar}
                    </span>
                );
            })}
            </div>
        </div>
    );
};

export default Form;