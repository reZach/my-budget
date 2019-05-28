import { Dispatch } from "../reducers/types";
import i18n from "../utils/i18n/i18n.config";

export const SET_LANGUAGE = "SET_LANGUAGE";

const setLanguagePrivate = function setLanguagePrivate(language: string){
    return {
        type: SET_LANGUAGE,
        payload: {
            language
        }
    };
}

export function setLanguage(language: string){
    return (dispatch: Dispatch) => {
        dispatch(setLanguagePrivate(language));
        i18n.changeLanguage(language);        
    }
}
