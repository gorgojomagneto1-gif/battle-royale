// The Match - Minimal JS wired to the modern UI

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
const professors = [
    { id: 1, name: "Escudero Aguilar, Gudelia Sofía", department: "Docente UNMSM", image: "public/gudelia.jpg", rating: 4.8, votes: baseVotes, elo: 1500 },
    { id: 2, name: "Julio Chicana", department: "Docente UNMSM", image: "public/chicana.jpg", rating: 4.8, votes: baseVotes, elo: 1500 },
    { id: 3, name: "Acuña, Walter", department: "Docente UNMSM", image: "public/acuña.jpg", rating: 4.8, votes: baseVotes, elo: 1500 },
    { id: 4, name: "Arbaiza Gonzales, Luz Rossana", department: "Docente UNMSM", image: "public/s200_rossana.arbaiza_11zon.jpg", rating: 4.8, votes: baseVotes, elo: 1500 },
    { id: 5, name: "Montalvo Balarezo, Rocío Amelia", department: "Docente UNMSM", image: "public/rocio.png", rating: 4.8, votes: baseVotes, elo: 1500 },
    { id: 6, name: "Hinojosa Lazo, Hilmar Antonio", department: "Docente UNMSM", image: "public/hilmarhinojosa.yolasite.com_11zon.jpg", rating: 4.8, votes: baseVotes, elo: 1500 },
    { id: 7, name: "Malca Chuquiruna, Raquel Beatriz", department: "Docente UNMSM", image: "public/malca-chuquiruna-raquel-beatriz-19921211_11zon.jpeg", rating: 4.8, votes: baseVotes, elo: 1500 },
    { id: 8, name: "Calsina Miramira, Willy Hugo", department: "Docente UNMSM", image: "public/calsina.jpg", rating: 4.8, votes: baseVotes, elo: 1500 },
    { id: 9, name: "Vergiu Canto, Jorge Luis", department: "Docente UNMSM", image: "public/vergiu.jpg", rating: 4.8, votes: baseVotes, elo: 1500 },
    { id: 10, name: "Villena Presentación, Ricardo", department: "Docente UNMSM", image: "public/villena_11zon.jpg", rating: 4.8, votes: baseVotes, elo: 1500 },
    { id: 11, name: "Wong Cabanillas, Francisco Javier", department: "Docente UNMSM", image: "public/wong.jpg", rating: 4.8, votes: baseVotes, elo: 1500 },
    { id: 12, name: "Tinoco Gómez, Oscar Rafael", department: "Docente UNMSM", image: "public/tinoco.jpg", rating: 4.8, votes: baseVotes, elo: 1500 },
    { id: 13, name: "Bendezú Mejía, Christian Casto", department: "Docente UNMSM", image: "public/bendezu.jpg", rating: 4.8, votes: baseVotes, elo: 1500 },
    { id: 14, name: "Papanicolau Denegri, Jorge Nicolás Alejandro", department: "Docente UNMSM", image: "public/papaniculau.jpg", rating: 4.8, votes: baseVotes, elo: 1500 },
    { id: 15, name: "Pariona Llanos, Ricardo", department: "Docente UNMSM", image: "public/ricardo_pariona_llanos.jpg", rating: 4.8, votes: baseVotes, elo: 1500 }
];

const achievements = [
    { id: 'first_vote', name: 'Primer voto', description: 'Arrancaste', xp: 50, requirement: 1, type: 'votes', unlocked: false },
    { id: 'voter_10', name: 'Constante', description: '10 votos', xp: 120, requirement: 10, type: 'votes', unlocked: false },
    { id: 'voter_50', name: 'Pro', description: '50 votos', xp: 250, requirement: 50, type: 'votes', unlocked: false },
    { id: 'voter_100', name: 'Leyenda', description: '100 votos', xp: 500, requirement: 100, type: 'votes', unlocked: false },
    { id: 'streak_3', name: 'Racha x3', description: '3 días seguidos', xp: 150, requirement: 3, type: 'streak', unlocked: false },
    { id: 'streak_7', name: 'Racha x7', description: '7 días seguidos', xp: 320, requirement: 7, type: 'streak', unlocked: false },
    { id: 'night_owl', name: 'Nocturno', description: 'Votaste de madrugada', xp: 80, requirement: 1, type: 'special', unlocked: false },
    { id: 'speed_demon', name: 'Veloz', description: '5 votos en 1 min', xp: 120, requirement: 5, type: 'special', unlocked: false }
];

let gameState = {
    totalXP: 0,
    level: 1,
    totalVotes: 0,
    streak: 0,
    lastVoteDate: null,
    currentMatch: null,
    unlockedAchievements: []
};

function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function loadGameState() {
    // Full reset each load: clear storage, reset game state, set version marker
    localStorage.clear();
    localStorage.setItem('theMatchVersion', DATA_VERSION);
    gameState = {
        totalXP: 0,
        level: 1,
        totalVotes: 0,
        streak: 0,
        lastVoteDate: null,
        currentMatch: null,
        unlockedAchievements: []
    };
}

function saveGameState() {
    localStorage.setItem('theMatchState', JSON.stringify(gameState));
    localStorage.setItem('theMatchVersion', DATA_VERSION);
}

function loadProfessors() {
    const saved = localStorage.getItem('theMatchProfs');
    if (saved) {
        const data = JSON.parse(saved);
        data.forEach((sp) => {
            const prof = professors.find((p) => p.id === sp.id);
            if (prof) {
                prof.votes = Math.max(baseVotes, sp.votes || 0);
                prof.elo = sp.elo ?? prof.elo;
                prof.rating = sp.rating ?? prof.rating;
            }
        });
    }
}

function saveProfessors() {
    localStorage.setItem('theMatchProfs', JSON.stringify(professors));
    localStorage.setItem('theMatchVersion', DATA_VERSION);
}

function getRandomMatch() {
    const shuffled = [...professors].sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1]];
}

function displayMatch() {
    const match = getRandomMatch();
    gameState.currentMatch = match;

    const [a, b] = match;
    document.getElementById('imgA').src = a.image;
    document.getElementById('nameA').textContent = a.name;
    document.getElementById('deptA').textContent = a.department;
    document.getElementById('ratingA').textContent = a.rating.toFixed(1);
    document.getElementById('votesA').textContent = a.votes;

    document.getElementById('imgB').src = b.image;
    document.getElementById('nameB').textContent = b.name;
    document.getElementById('deptB').textContent = b.department;
    document.getElementById('ratingB').textContent = b.rating.toFixed(1);
    document.getElementById('votesB').textContent = b.votes;

    updateGlobalVotes();
}

function vote(index) {
    if (!gameState.currentMatch) return;

    const winner = gameState.currentMatch[index];
    const loser = gameState.currentMatch[1 - index];

    const K = 32;
    const expectedWinner = 1 / (1 + Math.pow(10, (loser.elo - winner.elo) / 400));
    const expectedLoser = 1 / (1 + Math.pow(10, (winner.elo - loser.elo) / 400));

    winner.elo = Math.round(winner.elo + K * (1 - expectedWinner));
    loser.elo = Math.round(loser.elo + K * (0 - expectedLoser));
    winner.votes++;
    winner.rating = Math.min(5, winner.rating + 0.01);

    gameState.totalVotes++;
    updateGlobalVotes();

    const today = new Date().toDateString();
    if (gameState.lastVoteDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        gameState.streak = gameState.lastVoteDate === yesterday.toDateString() ? gameState.streak + 1 : 1;
        gameState.lastVoteDate = today;
    }

    let xpGained = 10;
    if (gameState.streak >= 3) xpGained += 5;
    if (gameState.streak >= 7) xpGained += 10;
    gameState.totalXP += xpGained;

    checkAchievements();
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 6) unlockAchievement('night_owl');

    showToast(`${rand(frasesVoto)} +${xpGained} XP, ${rand(frasesToast)}`);

    saveGameState();
    saveProfessors();
    updateUI();

    setTimeout(() => displayMatch(), 300);
}

function skipMatch() {
    displayMatch();
}

function shareMatch() {
    const text = "Estoy votando en Battle Royale, mano. ¿Quién gana?";
    if (navigator.share) {
        navigator.share({ title: 'Battle Royale', text, url: window.location.href });
    } else {
        navigator.clipboard.writeText(`${text} ${window.location.href}`);
        showToast('Enlace copiado');
    }
}

function updateGlobalVotes() {
    const totalGlobal = gameState.totalVotes;
    const globalCounter = document.getElementById('globalVotes');
    if (globalCounter) {
        globalCounter.textContent = totalGlobal.toLocaleString();
        globalCounter.style.transform = 'scale(1.15)';
        setTimeout(() => (globalCounter.style.transform = 'scale(1)'), 160);
    }
}

function checkAchievements() {
    achievements.filter((a) => a.type === 'votes' && !a.unlocked).forEach((a) => {
        if (gameState.totalVotes >= a.requirement) unlockAchievement(a.id);
    });

    achievements.filter((a) => a.type === 'streak' && !a.unlocked).forEach((a) => {
        if (gameState.streak >= a.requirement) unlockAchievement(a.id);
    });
}

function unlockAchievement(id) {
    const ach = achievements.find((a) => a.id === id);
    if (!ach || ach.unlocked) return;
    ach.unlocked = true;
    gameState.unlockedAchievements.push(id);
    gameState.totalXP += ach.xp;
    saveGameState();
}

function updateUI() {
    const xpForNextLevel = gameState.level * 200;
    const progress = ((gameState.totalXP % xpForNextLevel) / xpForNextLevel) * 100;

    const fill = document.getElementById('xpFill');
    if (fill) fill.style.width = `${Math.min(progress, 100)}%`;

    const xpValue = document.getElementById('xpValue');
    if (xpValue) xpValue.textContent = gameState.totalXP;

    const streak = document.getElementById('streak');
    if (streak) streak.textContent = gameState.streak;
}

function showSection(section) {
    document.querySelectorAll('.panel').forEach((p) => p.classList.add('hidden'));
    const target = document.getElementById(section);
    if (target) target.classList.remove('hidden');

    if (section === 'ranking') renderRanking();
    if (section === 'logros') renderAchievements();
}

function renderRanking() {
    const list = document.getElementById('rankingList');
    if (!list) return;
    list.innerHTML = '';
    const sorted = [...professors].sort((a, b) => b.elo - a.elo);
    sorted.forEach((prof, i) => {
        const div = document.createElement('div');
        div.className = 'rank-item';
        div.innerHTML = `
            <div class="rank-pos">${i + 1}</div>
            <div class="rank-avatar">
                <img src="${prof.image}" alt="${prof.name}" />
            </div>
            <div class="rank-info">
                <h4>${prof.name}</h4>
                <p>${prof.department}</p>
            </div>
            <div class="rank-score">
                <div>${prof.elo}</div>
                <div class="votes">${prof.votes} votos</div>
            </div>
        `;
        list.appendChild(div);
    });
}

function renderAchievements() {
    const grid = document.getElementById('achievementsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    achievements.forEach((ach) => {
        let progress = 0;
        if (ach.type === 'votes') progress = Math.min((gameState.totalVotes / ach.requirement) * 100, 100);
        else if (ach.type === 'streak') progress = Math.min((gameState.streak / ach.requirement) * 100, 100);
        const div = document.createElement('div');
        div.className = `achv ${ach.unlocked ? '' : 'locked'}`;
        div.innerHTML = `
            <div class="xp-tag">+${ach.xp} XP</div>
            <h4>${ach.name}</h4>
            <p>${ach.description}</p>
            ${ach.unlocked ? '<span>Liberado</span>' : `<div class="progress"><div class="fill" style="width:${progress}%"></div></div>`}
        `;
        grid.appendChild(div);
    });
}

function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
}

document.addEventListener('DOMContentLoaded', () => {
    loadGameState();
    loadProfessors();
    displayMatch();
    updateUI();
    updateGlobalVotes();

    document.querySelectorAll('.nav-btn').forEach((btn) => {
        btn.addEventListener('click', () => showSection(btn.dataset.section));
    });

    document.querySelectorAll('.vote').forEach((btn) => {
        btn.addEventListener('click', () => vote(btn.dataset.choice === 'A' ? 0 : 1));
    });

    document.getElementById('skip').addEventListener('click', skipMatch);
    document.getElementById('share').addEventListener('click', shareMatch);
});
