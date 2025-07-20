import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import './App.css';

function App() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState('en');
  const [darkMode, setDarkMode] = useState(false);
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamScores, setTeamScores] = useState([]);

  // Synthetic 2025 NFL standings with AFC/NFC conference info
  const syntheticData = [
    { team: "Eagles", wins: 12, conference: "NFC", scores: [24, 28, 21, 35, 27] },
    { team: "Chiefs", wins: 11, conference: "AFC", scores: [21, 24, 28, 26, 30] },
    { team: "49ers", wins: 10, conference: "NFC", scores: [20, 22, 24, 19, 25] },
    { team: "Bills", wins: 9, conference: "AFC", scores: [23, 18, 26, 22, 28] },
    { team: "Cowboys", wins: 8, conference: "NFC", scores: [17, 20, 21, 24, 27] },
    { team: "Dolphins", wins: 7, conference: "AFC", scores: [16, 19, 22, 21, 23] },
  ];

  // Load data initially and refresh every minute (simulated live)
  useEffect(() => {
    setTeams(syntheticData);
    setFilteredTeams(syntheticData);
    setSelectedTeam(syntheticData[0].team);
    setTeamScores(syntheticData[0].scores);

    const interval = setInterval(() => {
      // Simulate live updates (randomly modify wins slightly)
      const updated = syntheticData.map(t => ({
        ...t,
        wins: t.wins + Math.floor(Math.random() * 2 - 1) // +/-1 wins (random)
      }));
      setTeams(updated);
      setFilteredTeams(updated);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    i18n.changeLanguage(e.target.value);
  };

  const handleTeamChange = (e) => {
    const team = e.target.value;
    setSelectedTeam(team);
    const teamData = teams.find(t => t.team === team);
    if (teamData) setTeamScores(teamData.scores);
  };

  const handleFilter = (filter) => {
    if (filter === "ALL") {
      setFilteredTeams(teams);
    } else {
      setFilteredTeams(teams.filter(t => t.conference === filter));
    }
    if (teams.length > 0) {
      setSelectedTeam(teams[0].team);
      setTeamScores(teams[0].scores);
    }
  };

  const barData = filteredTeams.map(t => ({ name: t.team, wins: t.wins }));
  const lineData = teamScores.map((score, idx) => ({ game: `Game ${idx + 1}`, score }));

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      {/* HEADER */}
      <header>
        <h1>{t('title')}</h1>
        <div className="controls">
          <select value={language} onChange={handleLanguageChange}>
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? t('lightMode') : t('darkMode')}
          </button>
        </div>
      </header>

      {/* INTRO SECTION */}
      <section className="intro">
        <h2>Welcome to the 2025 FirstDown Analytics Dashboard</h2>
        <p>
          This dashboard shows <strong>2025 NFL team standings</strong> (synthetic live updates every minute)
          and score evolution per team. Use the filters and dropdowns below to interact with the data.
        </p>
      </section>

      {/* FILTERS */}
      <div className="filters">
        <button onClick={() => handleFilter("ALL")}>All Teams</button>
        <button onClick={() => handleFilter("AFC")}>AFC</button>
        <button onClick={() => handleFilter("NFC")}>NFC</button>
      </div>

      {/* MAIN CONTENT */}
      <main>
        <section className="chart-section">
          <h2>{t('barChart')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="wins" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="chart-section">
          <h2>{t('lineChart')}</h2>
          <label>
            {t('selectTeam')}:
            <select onChange={handleTeamChange} value={selectedTeam}>
              {filteredTeams.map(t => <option key={t.team} value={t.team}>{t.team}</option>)}
            </select>
          </label>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="game" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <p>© 2025 NFL Interactive Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
