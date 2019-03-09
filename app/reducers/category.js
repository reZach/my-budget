import { ADD_CATEGORY_ITEM, REMOVE_CATEGORY_ITEM, RENAME_CATEGORY_ITEM, CATEGORY_INITIAL_STATE } from "../actions/category";
import { Action, update } from "./types";

export default function category(state: any = CATEGORY_INITIAL_STATE, action: Action) {
    switch (action.type) {
        // case ADD_CATEGORY:            
        //     return update(state, { items: [...state.items, {name: action.payload.name }]});
        // case REMOVE_CATEGORY:            
        //     return update(state, { items: state.items.filter(e => e.name !== action.payload.name) })
        // case RENAME_CATEGORY:
        //     return update(state, )
        default:
            return state;
    }
}