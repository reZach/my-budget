import { ITEM_INITIAL_STATE } from "./item";
import { Store, Dispatch } from "../reducers/types";

export const ADD_ITEM = "ADD_ITEM";

export const ITEM_COLLECTION_INITIAL_STATE = [
    ITEM_INITIAL_STATE
];

var add_item = function(dateId: string, categoryId: string, name: string){
    return {
        type: ADD_ITEM,
        payload: {
            dateId: dateId,
            categoryId: categoryId,
            name: name
        }
    };
}

export function addItem(categoryId: string, name: string){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(add_item(
            store().date.id, categoryId, name));
    }
}