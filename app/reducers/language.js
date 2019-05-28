import { SET_LANGUAGE } from "../actions/language";
import { Action } from "./types";

export default function language(state: string = "en", action: Action){
    switch(action.type){
        case SET_LANGUAGE:
            return action.payload.language;
        default:
            return state;
    }
}