import {
    TRUE,
    FALSE
} from "../actions/modify";
import {
    Action
} from "./types";

export default function modified(state: boolean = false, action: Action) {
    switch (action.type) {
        case TRUE:
            return true;
        case FALSE:
            return false;
        default:
            return state;
    }
}