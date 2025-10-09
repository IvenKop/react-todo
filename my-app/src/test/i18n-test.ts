import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const i18nTest = i18n.createInstance();

i18nTest.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  initImmediate: false,
  interpolation: { escapeValue: false },
  resources: {
    en: {
      translation: {
        input: { placeholder: "What needs to be done?" },
        infoMenu: {
          all: "All",
          active: "Active",
          completed: "Completed",
          clearCompleted: "Clear completed",
        },
        footer: {
          doubleClick: "Double-click to edit a todo",
          createdBy: "Created by Team",
          partOf: "Part of TodoMVC",
        },
      },
    },
  },
});

export default i18nTest;
