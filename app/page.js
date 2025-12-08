'use client';

import { useState, useEffect } from 'react';
import { supabase } from './supabase';

const DATA_VERSION = '2025-12-zero-votes';

const frasesVoto = [
    "¡Buen voto!",
    "¡Elección sólida!",
    "¡Gran docente!",
    "¡Me gusta!",
    "¡Bacán!"
];

const frasesRacha = [
    "Sigues en racha",
    "No pares",
    "Ritmo ganador",
    "Al toque",
    "Con punche"
];

const frasesToast = [
    "mano",
    "al toque",
    "tranqui",
    "ya pe",
    "bacán"
];

const ELO_K = 32;

function calcularProbabilidad(rating1, rating2) {
    return 1 / (1 + Math.pow(10, (rating2 - rating1) / 400));
}

function actualizarELO(ratingGanador, ratingPerdedor) {
    const probabilidadGanador = calcularProbabilidad(ratingGanador, ratingPerdedor);
    const probabilidadPerdedor = 1 - probabilidadGanador;

    const nuevoRatingGanador = ratingGanador + ELO_K * (1 - probabilidadGanador);
    const nuevoRatingPerdedor = ratingPerdedor + ELO_K * (0 - probabilidadPerdedor);

    return [nuevoRatingGanador, nuevoRatingPerdedor];
}

export default function Home() {
    const [teachers, setTeachers] = useState([]);
    const [match, setMatch] = useState([]);
    const [streak, setStreak] = useState(0);
    const [toast, setToast] = useState('');

    useEffect(() => {
        const getTeachers = async () => {
            const { data: teachersData, error } = await supabase.from('teachers').select('*');
            if (error) {
                console.error('Error fetching teachers:', error);
            } else {
                setTeachers(teachersData);
            }
        };
        getTeachers();
    }, []);

    useEffect(() => {
        if (teachers.length > 0) {
            selectNewMatch();
        }
    }, [teachers]);

    function selectNewMatch() {
        const availableTeachers = teachers.filter(t => !t.eliminated);
        if (availableTeachers.length < 2) {
            setMatch([]);
            return;
        }

        let index1 = Math.floor(Math.random() * availableTeachers.length);
        let index2 = Math.floor(Math.random() * availableTeachers.length);
        while (index1 === index2) {
            index2 = Math.floor(Math.random() * availableTeachers.length);
        }

        setMatch([availableTeachers[index1], availableTeachers[index2]]);
    }

    async function handleVote(winner, loser) {
        const [nuevoRatingGanador, nuevoRatingPerdedor] = actualizarELO(winner.rating, loser.rating);

        const { error: winnerError } = await supabase
            .from('teachers')
            .update({ rating: nuevoRatingGanador, votes: winner.votes + 1 })
            .eq('id', winner.id);

        const { error: loserError } = await supabase
            .from('teachers')
            .update({ rating: nuevoRatingPerdedor })
            .eq('id', loser.id);

        if (winnerError || loserError) {
            console.error('Error updating ratings:', { winnerError, loserError });
            return;
        }

        setTeachers(prevTeachers => {
            return prevTeachers.map(t => {
                if (t.id === winner.id) return { ...t, rating: nuevoRatingGanador, votes: t.votes + 1 };
                if (t.id === loser.id) return { ...t, rating: nuevoRatingPerdedor };
                return t;
            });
        });

        const randomToast = frasesToast[Math.floor(Math.random() * frasesToast.length)];
        const randomFrase = streak > 2 ? frasesRacha[Math.floor(Math.random() * frasesRacha.length)] : frasesVoto[Math.floor(Math.random() * frasesVoto.length)];
        setToast(`${randomFrase}, ${randomToast}`);
        setStreak(streak + 1);

        setTimeout(() => {
            setToast('');
        }, 2000);

        selectNewMatch();
    }

    const sortedTeachers = [...teachers].sort((a, b) => b.rating - a.rating);

    if (match.length < 2) {
        return (
            <main className="container">
                <h1>Battle Royale de Docentes</h1>
                <h2>Ranking de Docentes</h2>
                <div className="ranking">
                    {sortedTeachers.map((teacher, index) => (
                        <div key={teacher.id} className="teacher-ranking">
                            <span className="rank">#{index + 1}</span>
                            <img src={teacher.image} alt={teacher.name} width={50} height={50} />
                            <span className="name">{teacher.name}</span>
                            <span className="rating">{Math.round(teacher.rating)}</span>
                        </div>
                    ))}
                </div>
            </main>
        )
    }

    return (
        <main>
            {toast && <div className="toast">{toast}</div>}
            <div className="battle-container">
                <div className="teacher" onClick={() => handleVote(match[0], match[1])}>
                    <img src={match[0].image} alt={match[0].name} />
                    <h3>{match[0].name}</h3>
                </div>
                <div className="vs">VS</div>
                <div className="teacher" onClick={() => handleVote(match[1], match[0])}>
                    <img src={match[1].image} alt={match[1].name} />
                    <h3>{match[1].name}</h3>
                </div>
            </div>
            <div className="ranking-container">
                <h2>Ranking</h2>
                <div className="ranking">
                    {sortedTeachers.slice(0, 10).map((teacher, index) => (
                        <div key={teacher.id} className="teacher-ranking">
                            <span className="rank">#{index + 1}</span>
                            <img src={teacher.image} alt={teacher.name} width={30} height={30} />
                            <span className="name">{teacher.name}</span>
                            <span className="rating">{Math.round(teacher.rating)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
