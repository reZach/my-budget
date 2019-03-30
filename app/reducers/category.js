import {
    ADD_CATEGORY_ITEM,
    REMOVE_CATEGORY_ITEM,
    CATEGORY_INITIAL_STATE
} from "../actions/category";
import {
    Action,
    update
} from "./types";



export default function category(state: any = CATEGORY_INITIAL_STATE, action: Action) {
    switch (action.type) {   
        case RENAME_CATEGORY_ITEM:
            console.error('hit');
            return state;     
        default:
            return state;
    }
}