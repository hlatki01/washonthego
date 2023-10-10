import React, { createContext, useContext } from 'react';
import i18n from '../utils/i18n'; // Import your i18n configuration

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  return (
    <TranslationContext.Provider value={i18n}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  return useContext(TranslationContext);
};
