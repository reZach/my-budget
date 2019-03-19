import {
    SAVE
} from "../actions/save";
import {
    Action,
    update
} from "./types";


export default function save(state: any = {}, action: Action) {
    switch (action.type){
        case SAVE:
            return state;
        default:
            return state;
    }
}