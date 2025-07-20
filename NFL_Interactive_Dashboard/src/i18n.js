import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      title: "NFL Interactive Dashboard",
      barChart: "Top NFL Teams by Wins",
      lineChart: "Score Evolution",
      selectTeam: "Select Team",
      darkMode: "Dark Mode",
      lightMode: "Light Mode"
    }
  },
  fr: {
    translation: {
      title: "Tableau de bord NFL interactif",
      barChart: "Meilleures équipes NFL par victoires",
      lineChart: "Évolution du score",
      selectTeam: "Sélectionnez une équipe",
      darkMode: "Mode Sombre",
      lightMode: "Mode Clair"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
