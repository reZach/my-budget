import { SET_PASSPHRASE } from "../actions/passphrase";
import { Action } from "./types";

export default function passphrase(state: string = "", action: Action){
    switch(action.type){
        case SET_PASSPHRASE:
            return action.payload.passphrase;
        default:
            return state;
    }    
}