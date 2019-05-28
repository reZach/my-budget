const i18n = require('i18next');
import { initReactI18next } from 'react-i18next';
import config from "./i18n.languages.config";

const i18nextOptions = {    
    interpolation: {
        escapeValue: false
    },
    debug: true,    
    saveMissing: true,
    fallbackLng: config.fallbackLng,
    whitelist: config.whitelist,
    defaultLocale: config.fallbackLng,
    react: {
        wait: false
    }
};

i18n.use(initReactI18next);

// if (!i18n.isInitialized){
//     i18n.init(i18nextOptions).then(function(value){
//         //i18n.changeLanguage("en");
//     });    
// }

export default i18n;