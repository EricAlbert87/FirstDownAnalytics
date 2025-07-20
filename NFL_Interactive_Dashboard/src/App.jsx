import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import './App.css';

function App() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState('en');
  const [darkMode, setDarkMode] = useState(false);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamScores, setTeamScores] = useState([]);

  useEffect(() => {
    // Fetch NFL data (public JSON or fallback synthetic data)
    fetch('https://raw.githubusercontent.com/BurntSushi/nfl-rankings/master/standings.json')
      .then(res => res.json())
      .then(data => {
        const topTeams = data.slice(0, 5).map(t => ({
          team: t.team,
          wins: t.wins,
          scores: t.scores || [10, 14, 21, 17, 24]
        }));
        setTeams(topTeams);
        setSelectedTeam(topTeams[0].team);
        setTeamScores(topTeams[0].scores);
      })
      .catch(() => {
        const synthetic = [
          { team: "Eagles", wins: 12, scores: [24, 28, 21, 35, 27] },
          { team: "Chiefs", wins: 11, scores: [21, 24, 28, 26, 30] },
          { team: "49ers", wins: 10, scores: [20, 22, 24, 19, 25] },
          { team: "Bills", wins: 9, scores: [23, 18, 26, 22, 28] },
          { team: "Cowboys", wins: 8, scores: [17, 20, 21, 24, 27] }
        ];
        setTeams(synthetic);
        setSelectedTeam("Eagles");
        setTeamScores(synthetic[0].scores);
      });
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

  const barData = teams.map(t => ({ name: t.team, wins: t.wins }));
  const lineData = teamScores.map((score, idx) => ({ game: `Game ${idx + 1}`, score }));

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
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
              {teams.map(t => <option key={t.team} value={t.team}>{t.team}</option>)}
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
    </div>
  );
}

export default App;
