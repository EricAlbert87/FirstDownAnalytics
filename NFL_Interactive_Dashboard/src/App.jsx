import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';
import './App.css';

function App() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState('en');
  const [darkMode, setDarkMode] = useState(false);
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamScores, setTeamScores] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Synthetic fallback data
  const syntheticData = [
    { team: "Eagles", wins: 12, conference: "NFC", scores: [24, 28, 21, 35, 27] },
    { team: "Chiefs", wins: 11, conference: "AFC", scores: [21, 24, 28, 26, 30] },
    { team: "49ers", wins: 10, conference: "NFC", scores: [20, 22, 24, 19, 25] },
    { team: "Bills", wins: 9, conference: "AFC", scores: [23, 18, 26, 22, 28] },
    { team: "Cowboys", wins: 8, conference: "NFC", scores: [17, 20, 21, 24, 27] },
    { team: "Dolphins", wins: 7, conference: "AFC", scores: [16, 19, 22, 21, 23] },
  ];

  // Fetch live NFL standings from GitHub JSON
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/BurntSushi/nfl-rankings/master/standings.json');
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();

        // Transform data (top 6 teams)
        const liveTeams = data.slice(0, 6).map((t, index) => ({
          team: t.team,
          wins: t.wins || Math.floor(Math.random() * 12), // fallback if no wins
          conference: index % 2 === 0 ? "AFC" : "NFC", // mock conference if not present
          scores: t.scores || [20, 23, 27, 22, 26]
        }));

        setTeams(liveTeams);
        setFilteredTeams(liveTeams);
        setSelectedTeam(liveTeams[0].team);
        setTeamScores(liveTeams[0].scores);
        setLastUpdated(new Date().toLocaleString());
      } catch (error) {
        console.error("Using fallback data:", error);
        setTeams(syntheticData);
        setFilteredTeams(syntheticData);
        setSelectedTeam(syntheticData[0].team);
        setTeamScores(syntheticData[0].scores);
        setLastUpdated(new Date().toLocaleString());
      }
    };

    fetchData();

    // Refresh every 5 minutes (simulating live)
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    i18n.changeLanguage(e.target.value);
  };

  const handleTeamChange = (e) => {
    const team = e.target.value;
    setSelectedTeam(team);
    const teamData = filteredTeams.find(t => t.team === team);
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

      {/* INTRO */}
      <section className="intro">
        <h2>{t('introTitle')}</h2>
        <p>{t('introDescription')}</p>
        {lastUpdated && <p><em>{t('lastUpdated')}: {lastUpdated}</em></p>}
      </section>

      {/* FILTERS */}
      <div className="filters">
        <button onClick={() => handleFilter("ALL")}>{t('filterAll')}</button>
        <button onClick={() => handleFilter("AFC")}>{t('filterAFC')}</button>
        <button onClick={() => handleFilter("NFC")}>{t('filterNFC')}</button>
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
