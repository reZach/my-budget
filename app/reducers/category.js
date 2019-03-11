import {
    ADD_CATEGORY_ITEM,
    REMOVE_CATEGORY_ITEM,
    RENAME_CATEGORY_ITEM,
    CATEGORY_INITIAL_STATE
} from "../actions/category";
import {
    Action,
    update
} from "./types";



export default function category(state: any = CATEGORY_INITIAL_STATE, action: Action) {
    switch (action.type) {        
        default:
            return state;
    }
}