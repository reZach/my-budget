import { ITEM_INITIAL_STATE } from "./item";
import { Store, Dispatch } from "../reducers/types";

export const ADD_ITEM = "ADD_ITEM";
export const REMOVE_ITEM = "REMOVE_ITEM";
export const RENAME_ITEM = "RENAME_ITEM";
export const ENTRY_ITEMS = "ENTRY_ITEMS";

export const ITEM_COLLECTION_INITIAL_STATE = [
    ITEM_INITIAL_STATE
];

const add_item = function(dateId: string, categoryId: string, name: string){
    return {
        type: ADD_ITEM,
        payload: {
            dateId,
            categoryId,
            name
        }
    };
}
const remove_item = function(dateId: string, categoryId: string, id: string){
    return {
        type: REMOVE_ITEM,
        payload: {
            dateId,
            categoryId,
            id
        }
    };
}
const rename_item = function(dateId: string, categoryId: string, id: string, newName: string){
    return {
        type: RENAME_ITEM,
        payload: {
            dateId,
            categoryId,
            id,            
            newName
        }        
    };
}
const entry_items = function(items: any){
    return {
        type: ENTRY_ITEMS,
        payload: {
            items
        }
    };
}

export function addItem(categoryId: string, name: string){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(add_item(
            store().date.id, categoryId, name));
    }
}
export function addItem2(dateId: String, categoryId: String, name: string){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(add_item(dateId, categoryId, name));
    }
}
export function removeItem(categoryId: string, id: string){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(remove_item(
            store().date.id, categoryId, id));
    }
}
export function renameItem(categoryId: string, id: string, newName: string) {
    return (dispatch: Dispatch, store: Store) => {
        dispatch(rename_item(store().date.id, categoryId, id, newName));
    }
}
export function entryItems(items: any){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(entry_items(items));
    }
}