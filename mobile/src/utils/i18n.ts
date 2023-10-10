import 'intl-pluralrules';


import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json'; // English translations
import pt from './locales/pt.json'; // Spanish translations

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            pt: { translation: pt },
            // Add more languages and translations as needed
        },
        lng: 'pt', // Default language
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
