import {
    SAVE
} from "../actions/save";
import {
    Action
} from "./types";


export default function save(state: boolean = false, action: Action) {
    switch (action.type){
        case SAVE:
            return state;
        default:
            return state;
    }
}