import { Store, Dispatch } from "../reducers/types";


export const MODIFY_IMPORT_CHECKBOX = "MODIFY_IMPORT_CHECKBOX";
export const MODIFY_ALL_IMPORT_CHECKBOX = "MODIFY_ALL_IMPORT_CHECKBOX";
export const MODIFY_IMPORT_CATEGORY = "MODIFY_IMPORT_CATEGORY";
export const MODIFY_IMPORT_ITEM = "MODIFY_IMPORT_ITEM";
export const SET_CATEGORY_ID = "SET_CATEGORY_ID";
export const SET_ITEM_ID = "SET_ITEM_ID";
export const SET_NOTE = "SET_NOTE";
export const SET_OVERWRITE_CATEGORY_NAME = "SET_OVERWRITE_CATEGORY_NAME";
export const SET_OVERWRITE_ITEM_NAME = "SET_OVERWRITE_ITEM_NAME";
export const SET_OVERWRITE_NOTE = "SET_OVERWRITE_NOTE";
export const SORT_IMPORT_TRANSACTIONS = "SORT_IMPORT_TRANSACTIONS";
export const ADD_IMPORT_TRANSACTION = "ADD_IMPORT_TRANSACTION";
export const REMOVE_ALL_IMPORT_TRANSACTIONS = "REMOVE_ALL_IMPORT_TRANSACTIONS";

var modify_import_checkbox = function(id: string, value: boolean){
    return {
        type: MODIFY_IMPORT_CHECKBOX,
        payload: {
            id: id,
            value: value
        }
    };
}

var modify_all_import_checkbox = function(value: boolean){
    return {
        type: MODIFY_ALL_IMPORT_CHECKBOX,
        payload: {
            value: value
        }
    };
}

var modify_import_category = function(id: string, category: string){
    return {
        type: MODIFY_IMPORT_CATEGORY,
        payload:{
            id: id,
            category: category
        }
    };
}

var modify_import_item = function(id: string, item: string){
    return {
        type: MODIFY_IMPORT_ITEM,
        payload: {
            id: id,
            item: item
        }
    };
}

var set_category_id = function(id: String, categoryId: string){
    return {
        type: SET_CATEGORY_ID,
        payload: {
            id: id,
            categoryId: categoryId
        }
    };
}

var set_item_id = function(id: String, itemId: string){
    return {
        type: SET_ITEM_ID,
        payload: {
            id: id,
            itemId: itemId
        }
    };
}

var set_note = function(id: String, note: string) {
    return {
        type: SET_NOTE,
        payload: {
            id: id,
            note: note
        }
    };
}

var set_overwrite_category_name = function(id: String, name: string){
    return {
        type: SET_OVERWRITE_CATEGORY_NAME,
        payload: {
            id: id,
            name: name
        }
    };
}

var set_overwrite_item_name = function(id: String, name: string){
    return {
        type: SET_OVERWRITE_ITEM_NAME,
        payload: {
            id: id,
            name: name
        }
    };
}

var set_overwrite_note = function(id: String, note: string){
    return {
        type: SET_OVERWRITE_NOTE,
        payload: {
            id: id,
            note: note
        }
    };
}

var sort_import_transactions = function(){
    return {
        type: SORT_IMPORT_TRANSACTIONS,
        payload: {}
    };
}

var remove_all_import_transactions = function(){
    return {
        type: REMOVE_ALL_IMPORT_TRANSACTIONS,
        payload: {}
    };
}

var add_import_transaction = function(id: string, toImport: boolean, dateId: string, categoryId: string, categoryName: string, itemId: string, itemName: string, day: number, amount: string, note: string, overwriteCategoryName: String, overwriteItemName: string, overwriteNote: string){
    return {
        type: ADD_IMPORT_TRANSACTION,
        payload: {
            id: id,
            toImport: toImport,
            dateId: dateId,
            categoryId: categoryId,
            categoryName: categoryName,
            itemId: itemId,
            itemName: itemName,
            day: day,
            amount: amount,
            note: note,
            overwriteCategoryName: overwriteCategoryName,
            overwriteItemName: overwriteItemName,
            overwriteNote: overwriteNote
        }
    };
}

export function modifyImportCheckbox(id: String, value: boolean){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(modify_import_checkbox(id, value));
    }
}

export function modifyAllImportCheckbox(value: boolean){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(modify_all_import_checkbox(value));
    }
}

export function sortImportTransactions(){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(sort_import_transactions());
    }
}

export function setCategoryId(id: String, categoryId: string){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(set_category_id(id, categoryId));
    }
}

export function setItemId(id: String, itemId: string){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(set_item_id(id, itemId));
    }
}

export function setNote(id: String, note: string){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(set_note(id, note));
    }
}

export function setOverwriteCategoryName(id: String, name: string){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(set_overwrite_category_name(id, name));
    }
}

export function setOverwriteItemName(id: String, name: string){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(set_overwrite_item_name(id, name));
    }
}

export function setOverwriteNote(id: String, note: string){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(set_overwrite_note(id, note));
    }
}

export function removeAllImportTransactions(){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(remove_all_import_transactions());
    }    
}

export function addImportTransaction(id: String, toImport: Boolean, dateId: String, categoryId: String, categoryName: String, itemId: String, itemName: String, day: Number, amount: String, note: string, overwriteCategoryName: String, overwriteItemName: string, overwriteNote: string){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(add_import_transaction(id, toImport, dateId, categoryId, categoryName, itemId, itemName, day, amount, note, overwriteCategoryName, overwriteItemName, overwriteNote));
    }
}