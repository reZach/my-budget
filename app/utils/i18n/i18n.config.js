import config from "./i18n.languages.config";

const isDev = require('electron-is-dev');

let path = "";

// Because we force refresh the app once after we start
// because of some weird bug, the first time the below
// code runs it throws an error. The second time it succeeds.
// Don't know why...
if (!isDev){
    try{
        path = require('electron').remote.getGlobal('sharedObject').value;
    } catch (e){
        console.log(e);
    }    
}

const i18n = require('i18next');
const i18nextBackend = require('i18next-node-fs-backend');

const i18nextOptions = {
    backend: {
        // path where resources get loaded from
        loadPath: isDev ? "./app/utils/i18n/locales/{{lng}}/{{ns}}.json" :
            `${path}.unpacked/app/utils/i18n/locales/{{lng}}/{{ns}}.json`,

        // path to post missing resources
        addPath: isDev ? "./app/utils/i18n/locales/{{lng}}/{{ns}}.missing.json" :
            `${path}.unpacked/app/utils/i18n/locales/{{lng}}/{{ns}}.missing.json`,

        // jsonIndent to use when storing json files
        jsonIndent: 4,
    },
    debug: true,
    interpolation: {
        escapeValue: false
    },
    namespace: "transaction",
    saveMissing: true,
    saveMissingTo: "current",
    fallbackLng: "en", // set to false when generating translation files locally
    whitelist: config.whitelist,
    react: {
        wait: false
    }
};

if (!i18n.isInitialized){
    i18n.use(i18nextBackend).init(i18nextOptions).then(function(){
        i18n.changeLanguage(config.fallbackLng, (err) => {
            if (err){
                return console.log("couldn't change language");
            }
        });
        return true;
    }).catch(function(err){
        console.error(err);
    });
}

export default i18n;