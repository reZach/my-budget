import { CATEGORY_INITIAL_STATE } from "./category";
import { Dispatch } from "../reducers/types";

export const ADD_CATEGORY = "ADD_CATEGORY";
export const REMOVE_CATEGORY = "REMOVE_CATEGORY";
export const RENAME_CATEGORY = "RENAME_CATEGORY";
export const ENTRY_CATEGORIES = "ENTRY_CATEGORIES";

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
var rename_category = function(dateId: string, categoryId: string, newName: string){
    return {
        type: RENAME_CATEGORY,
        payload: {
            dateId: dateId,
            categoryId: categoryId,
            newName: newName
        }        
    };
}
var entry_categories = function(categories: any){
    return {
        type: ENTRY_CATEGORIES,
        payload: {
            categories: categories
        }
    };
}

export function addCategory(name: string) {
    return (dispatch: Dispatch, store: Store) => {
        dispatch(add_category(
            store().date.id, name));
    }
}

export function addCategory2(dateId: String, name: string) {
    return (dispatch: Dispatch, store: Store) => {
        dispatch(add_category(dateId, name));
    }
}

export function removeCategory(categoryId: string) {
    return (dispatch: Dispatch, store: Store) => {
        dispatch(remove_category(
            store().date.id, categoryId));
    }
}

export function renameCategory(categoryId: string, newName: string) {
    return (dispatch: Dispatch, store: Store) => {
        dispatch(rename_category(
            store().date.id, categoryId, newName));
    }
}

export function entryCategories(categories: any){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(entry_categories(categories));
    }
}