import {
    TRUE,
    FALSE
} from "../actions/modify";
import {
    Action,
    update
} from "./types";

export default function modified(state: any = false, action: Action) {
    switch (action.type) {
        case TRUE:
            return true;
        case FALSE:
            return false;
        default:
            return state;
    }
}