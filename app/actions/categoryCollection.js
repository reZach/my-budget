import { CATEGORY_INITIAL_STATE } from "./category";
import { Dispatch } from "../reducers/types";

export const ADD_CATEGORY = "ADD_CATEGORY";
export const REMOVE_CATEGORY = "REMOVE_CATEGORY";
export const RENAME_CATEGORY = "RENAME_CATEGORY";
export const SET_CATEGORY_SPENT = "SET_CATEGORY_SPENT";
export const SET_COLLAPSE_CATEGORY = "SET_COLLAPSE_CATEGORY";
export const SET_COLLAPSE_CATEGORY_ALL = "SET_COLLAPSE_CATEGORY_ALL";
export const SORT_CATEGORIES_ALPHABETICALLY = "SORT_CATEGORIES_ALPHABETICALLY";
export const SORT_CATEGORIES_REVERSE_ALPHABETICALLY = "SORT_CATEGORIES_REVERSE_ALPHABETICALLY";
export const SORT_CATEGORIES_SPENT_DESCENDING = "SORT_CATEGORIES_SPENT_DESCENDING";
export const SORT_CATEGORIES_SPENT_ASCENDING = "SORT_CATEGORIES_SPENT_ASCENDING";
export const RECALCULATE_CATEGORY_SPENT = "RECALCULATE_CATEGORY_SPENT";
export const ENTRY_CATEGORIES = "ENTRY_CATEGORIES";

export const CATEGORY_COLLECTION_INITIAL_STATE = [
    CATEGORY_INITIAL_STATE
];

const addCategoryPrivate = function addCategoryPrivate(dateId: string, name: string, collapse: boolean, order: number, spent: number){
    return {
        type: ADD_CATEGORY,
        payload: {
            dateId,
            name,
            collapse,
            order,
            spent
        }
    };
}
const removeCategoryPrivate = function removeCategoryPrivate(dateId: string, categoryId: string){
    return {
        type: REMOVE_CATEGORY,
        payload: {
            dateId,
            categoryId
        }
    };
}
const renameCategoryPrivate = function renameCategoryPrivate(dateId: string, categoryId: string, newName: string){
    return {
        type: RENAME_CATEGORY,
        payload: {
            dateId,
            categoryId,
            newName
        }        
    };
}
const set_category_spent = function(dateId: string, categoryId: string, spent: string){    
    return {
        type: SET_CATEGORY_SPENT,
        payload: {
            dateId,
            categoryId,
            spent
        }
    };
}
const set_collapse_category = function(dateId: string, categoryId: string, collapse: boolean){
    return {
        type: SET_COLLAPSE_CATEGORY,
        payload: {
            dateId,
            categoryId,
            collapse
        }
    };
}
const set_collapse_category_all = function(dateId: string, collapse: boolean){
    return {
        type: SET_COLLAPSE_CATEGORY_ALL,
        payload: {
            dateId,
            collapse
        }
    };
}
const sort_alphabetically = function(dateId: string){
    return {
        type: SORT_CATEGORIES_ALPHABETICALLY,
        payload: {
            dateId
        }
    };
}
const sort_reverse_alphabetically = function(dateId: string){
    return {
        type: SORT_CATEGORIES_REVERSE_ALPHABETICALLY,
        payload: {
            dateId
        }
    };
}
const sort_spent_descending = function(dateId: string){
    return {
        type: SORT_CATEGORIES_SPENT_DESCENDING,
        payload: {
            dateId
        }
    };
}
const sort_spent_ascending = function(dateId: string){
    return {
        type: SORT_CATEGORIES_SPENT_ASCENDING,
        payload: {
            dateId
        }
    };
}
const entry_categories = function(categories: array){
    return {
        type: ENTRY_CATEGORIES,
        payload: {
            categories
        }
    };
}

export function addCategory(name: string, collapse: boolean, order: number, spent: number) {
    return (dispatch: Dispatch, store: Store) => {
        dispatch(addCategoryPrivate(
            store().date.id, name, collapse, order, spent));
    }
}

export function addCategory2(dateId: string, name: string, collapse: boolean, order: number, spent: number) {
    return (dispatch: Dispatch) => {
        dispatch(addCategoryPrivate(dateId, name, collapse, order, spent));
    }
}

export function removeCategory(categoryId: string) {
    return (dispatch: Dispatch, store: Store) => {
        dispatch(removeCategoryPrivate(
            store().date.id, categoryId));
    }
}

export function renameCategory(categoryId: string, newName: string) {
    return (dispatch: Dispatch, store: Store) => {
        dispatch(renameCategoryPrivate(
            store().date.id, categoryId, newName));
    }
}

export function setCategorySpent(dateId: string, categoryId: string, spent: string){
    return (dispatch: Dispatch) => {
        dispatch(set_category_spent(dateId, categoryId, spent));
    }
}

export function setCollapseCategory(categoryId: string, collapse: boolean){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(set_collapse_category(store().date.id, categoryId, collapse));
    }
}

export function setCollapseCategoryAll(collapse: boolean){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(set_collapse_category_all(store().date.id, collapse));
    }
}

export function sortAlphabetically(dateId: string){
    return (dispatch: Dispatch) => {
        dispatch(sort_alphabetically(dateId));
    }
}

export function sortReverseAlphabetically(dateId: string){
    return (dispatch: Dispatch) => {
        dispatch(sort_reverse_alphabetically(dateId));
    }
}

export function sortSpentDescending(dateId: string){
    return (dispatch: Dispatch) => {
        dispatch(sort_spent_descending(dateId));
    }
}

export function sortSpentAscending(dateId: string){
    return (dispatch: Dispatch) => {
        dispatch(sort_spent_ascending(dateId));
    }
}

export function recalculateCategorySpent(dateId: string, categoryId: string){
    return (dispatch: Dispatch, store: Store) => {
                
        const transactions = store().transactions.filter(t => t.dateId === dateId);
        let total = 0;
        let part = 0;
        
        for (let i = 0; i < transactions.length; i++){                        
            total += parseFloat(transactions[i].amount);

            if (transactions[i].categoryId === categoryId){
                part += parseFloat(transactions[i].amount);
            }
        }

        let calculated = "0";
        if (total !== 0){
            calculated = ((part / total) * 100).toFixed(2);
        }

        dispatch(set_category_spent(dateId, categoryId, calculated));
    }
}

export function entryCategories(categories: array){
    return (dispatch: Dispatch) => {
        dispatch(entry_categories(categories));
    }
}