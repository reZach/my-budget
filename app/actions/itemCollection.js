import { ITEM_INITIAL_STATE } from "./item";
import { Store, Dispatch } from "../reducers/types";

export const ADD_ITEM = "ADD_ITEM";
export const REMOVE_ITEM = "REMOVE_ITEM";

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
var remove_item = function(dateId: string, categoryId: string, id: string){
    return {
        type: REMOVE_ITEM,
        payload: {
            dateId: dateId,
            categoryId: categoryId,
            id: id
        }
    };
}

export function addItem(categoryId: string, name: string){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(add_item(
            store().date.id, categoryId, name));
    }
}
export function removeItem(categoryId: string, id: string){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(remove_item(
            store().date.id, categoryId, id));
    }
}