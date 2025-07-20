import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      title: "FirstDown Analytics",
      introTitle: "Welcome to the 2025 NFL Dashboard",
      introDescription: "This dashboard shows 2025 NFL team standings (synthetic live updates every minute) and score evolution per team. Use the filters and dropdowns below to interact with the data.",
      barChart: "Top NFL Teams by Wins",
      lineChart: "Score Evolution",
      selectTeam: "Select Team",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      filterAll: "All Teams",
      filterAFC: "AFC",
      filterNFC: "NFC"
    }
  },
  fr: {
    translation: {
      title: "FirstDown Analytics",
      introTitle: "Bienvenue sur le tableau de bord NFL 2025",
      introDescription: "Ce tableau de bord présente les classements des équipes NFL 2025 (mises à jour synthétiques chaque minute) et l'évolution des scores par équipe. Utilisez les filtres et menus déroulants ci-dessous pour interagir avec les données.",
      barChart: "Meilleures équipes NFL par victoires",
      lineChart: "Évolution du score",
      selectTeam: "Sélectionnez une équipe",
      darkMode: "Mode Sombre",
      lightMode: "Mode Clair",
      filterAll: "Toutes les équipes",
      filterAFC: "AFC",
      filterNFC: "NFC"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
