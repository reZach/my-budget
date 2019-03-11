import { CATEGORY_INITIAL_STATE } from "./category";
import { Dispatch } from "../reducers/types";

export const ADD_CATEGORY = "ADD_CATEGORY";
export const REMOVE_CATEGORY = "REMOVE_CATEGORY";

export const CATEGORY_COLLECTION_INITIAL_STATE = [
    CATEGORY_INITIAL_STATE
];

var add_category = function(dateId: string, name: string){
    return {
        type: ADD_CATEGORY,
        payload: {
            dateId: dateId,
            name: name
        }
    };
}
var remove_category = function(dateId: string, categoryId: string){
    return {
        type: REMOVE_CATEGORY,
        payload: {
            dateId: dateId,
            categoryId: categoryId
        }
    };
}

export function addCategory(name: string) {
    return (dispatch: Dispatch, store: Store) => {
        dispatch(add_category(
            store().date.id, name));
    }
}

export function removeCategory(categoryId: string) {
    return (dispatch: Dispatch, store: Store) => {
        dispatch(remove_category(
            store().date.id, categoryId));
    }
}