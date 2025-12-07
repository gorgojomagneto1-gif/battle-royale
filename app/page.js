'use client';

import { useState, useEffect } from 'react';

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

const baseVotes = 0;
const initialProfessors = [
    { id: 1, name: "Escudero Aguilar, Gudelia Sofía", department: "Docente UNMSM", image: "/gudelia.jpg", rating: 4.8, votes: baseVotes, elo: 1500 },
    { id: 2, name: "Julio Chicana", department: "Docente UNMSM", image: "/chicana.jpg", rating: 4.8, votes: baseVotes, elo: 1500 },
    { id: 3, name: "Acuña, Walter", department: "Docente UNMSM", image: "/acuña.jpg", rating: 4.8, votes: baseVotes, elo: 1500 },
    { id: 4, name: "Arbaiza Gonzales, Luz Rossana", department: "Docente UNMSM", image: "/s200_rossana.arbaiza_11zon.jpg", rating: 4.8, votes: baseVotes, elo: 1500 },
    { id: 5, name: "Montalvo Balarezo, Rocío Amelia", department: "Docente UNMSM", image: "/rocio.png", rating: 4.8, votes: baseVotes, elo: 1500 },
    { id: 6, name: "Hinojosa Lazo, Hilmar Antonio", department: "Docente UNMSM", image: "/hilmarhinojosa.yolasite.com_11zon.jpg", rating: 4.8, votes: baseVotes, elo: 1500 },
    { id: 7, name: "Malca Chuquiruna, Raquel Beatriz", department: "Docente UNMSM", image: "/malca-chuquiruna-raquel-beatriz-19921211_11zon.jpeg", rating: 4.8, votes: baseVotes, elo: 1500 },
    { id: 8, name: "Calsina Miramira, Willy Hugo", department: "Docente UNMSM", image: "/calsina.jpg", rating: 4.8, votes: baseVotes, elo: 1500 },
    { id: 9, name: "Vergiu Canto, Jorge Luis", department: "Docente UNMSM", image: "/vergiu.jpg", rating: 4.8, votes: baseVotes, elo: 1500 },
    { id: 10, name: "Villena Presentación, Ricardo", department: "Docente UNMSM", image: "/villena_11zon.jpg", rating: 4.8, votes: baseVotes, elo: 1500 },
    { id: 11, name: "Wong Cabanillas, Francisco Javier", department: "Docente UNMSM", image: "/wong.jpg", rating: 4.8, votes: baseVotes, elo: 1500 },
    { id: 12, name: "Tinoco Gómez, Oscar Rafael", department: "Docente UNMSM", image: "/tinoco.jpg", rating: 4.8, votes: baseVotes, elo: 1500 },
    { id: 13, name: "Bendezú Mejía, Christian Casto", department: "Docente UNMSM", image: "/bendezu.jpg", rating: 4.8, votes: baseVotes, elo: 1500 },
    { id: 14, name: "Papanicolau Denegri, Jorge Nicolás Alejandro", department: "Docente UNMSM", image: "/papaniculau.jpg", rating: 4.8, votes: baseVotes, elo: 1500 },
    { id: 15, name: "Pariona Llanos, Ricardo", department: "Docente UNMSM", image: "/ricardo_pariona_llanos.jpg", rating: 4.8, votes: baseVotes, elo: 1500 }
];

const initialAchievements = [
    { id: 'first_vote', name: 'Primer voto', description: 'Arrancaste', xp: 50, requirement: 1, type: 'votes', unlocked: false },
    { id: 'voter_10', name: 'Constante', description: '10 votos', xp: 120, requirement: 10, type: 'votes', unlocked: false },
    { id: 'voter_50', name: 'Pro', description: '50 votos', xp: 250, requirement: 50, type: 'votes', unlocked: false },
    { id: 'voter_100', name: 'Leyenda', description: '100 votos', xp: 500, requirement: 100, type: 'votes', unlocked: false },
    { id: 'streak_3', name: 'Racha x3', description: '3 días seguidos', xp: 150, requirement: 3, type: 'streak', unlocked: false },
    { id: 'streak_7', name: 'Racha x7', description: '7 días seguidos', xp: 320, requirement: 7, type: 'streak', unlocked: false },
    { id: 'night_owl', name: 'Nocturno', description: 'Votaste de madrugada', xp: 80, requirement: 1, type: 'special', unlocked: false },
    { id: 'speed_demon', name: 'Veloz', description: '5 votos en 1 min', xp: 120, requirement: 5, type: 'special', unlocked: false }
];

function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export default function Home() {
    const [section, setSection] = useState('home');
    const [professors, setProfessors] = useState(initialProfessors);
    const [achievements, setAchievements] = useState(initialAchievements);
    const [gameState, setGameState] = useState({
        totalXP: 0,
        level: 1,
        totalVotes: 0,
        streak: 0,
        lastVoteDate: null,
        unlockedAchievements: []
    });
    const [currentMatch, setCurrentMatch] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        // Load state from localStorage
        const savedState = localStorage.getItem('theMatchState');
        const savedProfs = localStorage.getItem('theMatchProfs');
        const savedVersion = localStorage.getItem('theMatchVersion');

        if (savedVersion === DATA_VERSION) {
            if (savedState) setGameState(JSON.parse(savedState));
            if (savedProfs) {
                const data = JSON.parse(savedProfs);
                const mergedProfs = initialProfessors.map(p => {
                    const saved = data.find(s => s.id === p.id);
                    return saved ? { ...p, ...saved } : p;
                });
                setProfessors(mergedProfs);
            }
        } else {
            localStorage.clear();
            localStorage.setItem('theMatchVersion', DATA_VERSION);
        }
        
        displayMatch();
    }, []);

    useEffect(() => {
        if (gameState.totalVotes > 0) {
            localStorage.setItem('theMatchState', JSON.stringify(gameState));
            localStorage.setItem('theMatchProfs', JSON.stringify(professors));
            localStorage.setItem('theMatchVersion', DATA_VERSION);
        }
    }, [gameState, professors]);

    const displayMatch = () => {
        const shuffled = [...professors].sort(() => Math.random() - 0.5);
        setCurrentMatch([shuffled[0], shuffled[1]]);
    };

    const showToastMsg = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2000);
    };

    const checkAchievements = (newState) => {
        let newUnlocked = [];
        let xpGained = 0;

        achievements.forEach(ach => {
            if (ach.unlocked) return;
            let unlocked = false;
            if (ach.type === 'votes' && newState.totalVotes >= ach.requirement) unlocked = true;
            if (ach.type === 'streak' && newState.streak >= ach.requirement) unlocked = true;
            
            if (unlocked) {
                newUnlocked.push(ach.id);
                xpGained += ach.xp;
                ach.unlocked = true;
                showToastMsg(`Logro desbloqueado: ${ach.name}`);
            }
        });

        if (newUnlocked.length > 0) {
            setAchievements([...achievements]);
            return xpGained;
        }
        return 0;
    };

    const vote = (index) => {
        if (!currentMatch) return;

        const winner = currentMatch[index];
        const loser = currentMatch[1 - index];

        const K = 32;
        const expectedWinner = 1 / (1 + Math.pow(10, (loser.elo - winner.elo) / 400));
        const expectedLoser = 1 / (1 + Math.pow(10, (winner.elo - loser.elo) / 400));

        const newWinnerElo = Math.round(winner.elo + K * (1 - expectedWinner));
        const newLoserElo = Math.round(loser.elo + K * (0 - expectedLoser));

        const updatedProfessors = professors.map(p => {
            if (p.id === winner.id) {
                return { ...p, elo: newWinnerElo, votes: p.votes + 1, rating: Math.min(5, p.rating + 0.01) };
            }
            if (p.id === loser.id) {
                return { ...p, elo: newLoserElo };
            }
            return p;
        });

        setProfessors(updatedProfessors);

        const today = new Date().toDateString();
        let newStreak = gameState.streak;
        let newLastVoteDate = gameState.lastVoteDate;

        if (gameState.lastVoteDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            newStreak = gameState.lastVoteDate === yesterday.toDateString() ? gameState.streak + 1 : 1;
            newLastVoteDate = today;
        }

        let xpGained = 10;
        if (newStreak >= 3) xpGained += 5;
        if (newStreak >= 7) xpGained += 10;

        const hour = new Date().getHours();
        if (hour >= 0 && hour < 6) {
             // Logic for night owl would go here if we tracked it in state properly
        }

        let newState = {
            ...gameState,
            totalVotes: gameState.totalVotes + 1,
            streak: newStreak,
            lastVoteDate: newLastVoteDate,
            totalXP: gameState.totalXP + xpGained
        };

        const achievementXp = checkAchievements(newState);
        newState.totalXP += achievementXp;

        setGameState(newState);
        showToastMsg(`${rand(frasesVoto)} +${xpGained} XP, ${rand(frasesToast)}`);
        
        setTimeout(displayMatch, 300);
    };

    const xpForNextLevel = gameState.level * 200;
    const progress = ((gameState.totalXP % xpForNextLevel) / xpForNextLevel) * 100;

    return (
        <>
            <div className="bg-grid"></div>

            <header className="topbar">
                <div className="brand">Battle Royale</div>
                <nav className="nav">
                    <button className={`nav-btn ${section === 'home' ? 'active' : ''}`} onClick={() => setSection('home')}>Inicio</button>
                    <button className={`nav-btn ${section === 'ranking' ? 'active' : ''}`} onClick={() => setSection('ranking')}>Ranking</button>
                    <button className={`nav-btn ${section === 'logros' ? 'active' : ''}`} onClick={() => setSection('logros')}>Logros</button>
                </nav>
                <div className="stats">
                    <div className="xp">
                        <span className="label">XP</span>
                        <div className="bar"><div className="fill" style={{ width: `${Math.min(progress, 100)}%` }}></div></div>
                        <span>{gameState.totalXP}</span>
                    </div>
                    <div className="streak"><span>{gameState.streak}</span> días 🔥</div>
                </div>
            </header>

            <main>
                {section === 'home' && (
                    <section className="panel">
                        <div className="hero">
                            <p className="eyebrow">Versus en vivo</p>
                            <h1>¿Quién es el mejor profe?</h1>
                            <p className="sub">Dos profesores, un solo clic. Vota por tu favorito y ayuda a decidir quién es el mejor.</p>
                        </div>

                        {currentMatch && (
                            <div className="versus">
                                <article className="card">
                                    <div className="badge live">EN VIVO</div>
                                    <div className="avatar"><img src={currentMatch[0].image} alt={currentMatch[0].name} /></div>
                                    <h3>{currentMatch[0].name}</h3>
                                    <p className="dept">{currentMatch[0].department}</p>
                                    <div className="meta">
                                        <span>⭐ {currentMatch[0].rating.toFixed(1)}</span>
                                        <span>👥 {currentMatch[0].votes}</span>
                                    </div>
                                    <button className="vote" onClick={() => vote(0)}>Votar</button>
                                </article>

                                <div className="vs">VS</div>

                                <article className="card">
                                    <div className="badge alt">Destacado</div>
                                    <div className="avatar"><img src={currentMatch[1].image} alt={currentMatch[1].name} /></div>
                                    <h3>{currentMatch[1].name}</h3>
                                    <p className="dept">{currentMatch[1].department}</p>
                                    <div className="meta">
                                        <span>⭐ {currentMatch[1].rating.toFixed(1)}</span>
                                        <span>👥 {currentMatch[1].votes}</span>
                                    </div>
                                    <button className="vote" onClick={() => vote(1)}>Votar</button>
                                </article>
                            </div>
                        )}

                        <div className="actions">
                            <button className="ghost" onClick={displayMatch}>Saltar pareja</button>
                            <button className="primary" onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                showToastMsg('Enlace copiado');
                            }}>Compartir match</button>
                        </div>

                        <div className="counter">
                            <p className="label">Votos de hoy</p>
                            <p className="number">{gameState.totalVotes.toLocaleString()}</p>
                        </div>
                    </section>
                )}

                {section === 'ranking' && (
                    <section className="panel">
                        <div className="section-head">
                            <h2>Ranking</h2>
                            <p>Ordenado por ELO.</p>
                        </div>
                        <div className="list">
                            {[...professors].sort((a, b) => b.elo - a.elo).map((prof, i) => (
                                <div key={prof.id} className="rank-item">
                                    <div className="rank-pos">{i + 1}</div>
                                    <div className="rank-avatar">
                                        <img src={prof.image} alt={prof.name} />
                                    </div>
                                    <div className="rank-info">
                                        <h4>{prof.name}</h4>
                                        <p>{prof.department}</p>
                                    </div>
                                    <div className="rank-score">
                                        <div>{prof.elo}</div>
                                        <div className="votes">{prof.votes} votos</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {section === 'logros' && (
                    <section className="panel">
                        <div className="section-head">
                            <h2>Logros</h2>
                            <p>Completa hitos y gana XP extra.</p>
                        </div>
                        <div className="grid">
                            {achievements.map(ach => {
                                let progress = 0;
                                if (ach.type === 'votes') progress = Math.min((gameState.totalVotes / ach.requirement) * 100, 100);
                                else if (ach.type === 'streak') progress = Math.min((gameState.streak / ach.requirement) * 100, 100);
                                
                                return (
                                    <div key={ach.id} className={`achv ${ach.unlocked ? '' : 'locked'}`}>
                                        <div className="xp-tag">+{ach.xp} XP</div>
                                        <h4>{ach.name}</h4>
                                        <p>{ach.description}</p>
                                        {ach.unlocked ? (
                                            <span>Liberado</span>
                                        ) : (
                                            <div className="progress"><div className="fill" style={{ width: `${progress}%` }}></div></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}
            </main>

            <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
        </>
    );
}
