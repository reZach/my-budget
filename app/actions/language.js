import { Dispatch } from "../reducers/types";

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
    }
}
