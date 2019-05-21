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

const modifyImportCheckboxPrivate = function modifyImportCheckboxPrivate(id: string, value: boolean){
    return {
        type: MODIFY_IMPORT_CHECKBOX,
        payload: {
            id,
            value
        }
    };
}

const modifyAllImportCheckboxPrivate = function modifyAllImportCheckboxPrivate(value: boolean){
    return {
        type: MODIFY_ALL_IMPORT_CHECKBOX,
        payload: {
            value
        }
    };
}

const modifyImportCategoryPrivate = function modifyImportCategoryPrivate(id: string, category: string){
    return {
        type: MODIFY_IMPORT_CATEGORY,
        payload:{
            id,
            category
        }
    };
}

const modifyImportItemPrivate = function modifyImportItemPrivate(id: string, item: string){
    return {
        type: MODIFY_IMPORT_ITEM,
        payload: {
            id,
            item
        }
    };
}

const setCategoryIdPrivate = function setCategoryIdPrivate(id: String, categoryId: string){
    return {
        type: SET_CATEGORY_ID,
        payload: {
            id,
            categoryId
        }
    };
}

const setItemIdPrivate = function setItemIdPrivate(id: String, itemId: string){
    return {
        type: SET_ITEM_ID,
        payload: {
            id,
            itemId
        }
    };
}

const setNotePrivate = function setNotePrivate(id: String, note: string) {
    return {
        type: SET_NOTE,
        payload: {
            id,
            note
        }
    };
}

const set_overwrite_category_name = function(id: String, name: string){
    return {
        type: SET_OVERWRITE_CATEGORY_NAME,
        payload: {
            id,
            name
        }
    };
}

const setOverwriteItemNamePrivate = function setOverwriteItemNamePrivate(id: String, name: string){
    return {
        type: SET_OVERWRITE_ITEM_NAME,
        payload: {
            id,
            name
        }
    };
}

const setOverwriteNotePrivate = function setOverwriteNotePrivate(id: String, note: string){
    return {
        type: SET_OVERWRITE_NOTE,
        payload: {
            id,
            note
        }
    };
}

const sortImportTransactionsPrivate = function sortImportTransactionsPrivate(){
    return {
        type: SORT_IMPORT_TRANSACTIONS,
        payload: {}
    };
}

const removeAllImportTransactionsPrivate = function removeAllImportTransactionsPrivate(){
    return {
        type: REMOVE_ALL_IMPORT_TRANSACTIONS,
        payload: {}
    };
}

const addImportTransactionPrivate = function addImportTransactionPrivate(id: string, toImport: boolean, dateId: string, categoryId: string, categoryName: string, itemId: string, itemName: string, day: number, amount: string, note: string, overwriteCategoryName: String, overwriteItemName: string, overwriteNote: string){
    return {
        type: ADD_IMPORT_TRANSACTION,
        payload: {
            id,
            toImport,
            dateId,
            categoryId,
            categoryName,
            itemId,
            itemName,
            day,
            amount,
            note,
            overwriteCategoryName,
            overwriteItemName,
            overwriteNote
        }
    };
}

export function modifyImportCheckbox(id: String, value: boolean){
    return (dispatch: Dispatch) => {
        dispatch(modifyImportCheckboxPrivate(id, value));
    }
}

export function modifyAllImportCheckbox(value: boolean){
    return (dispatch: Dispatch) => {
        dispatch(modifyAllImportCheckboxPrivate(value));
    }
}

export function sortImportTransactions(){
    return (dispatch: Dispatch) => {
        dispatch(sortImportTransactionsPrivate());
    }
}

export function setCategoryId(id: String, categoryId: string){
    return (dispatch: Dispatch) => {
        dispatch(setCategoryIdPrivate(id, categoryId));
    }
}

export function setItemId(id: String, itemId: string){
    return (dispatch: Dispatch) => {
        dispatch(setItemIdPrivate(id, itemId));
    }
}

export function setNote(id: String, note: string){
    return (dispatch: Dispatch) => {
        dispatch(setNotePrivate(id, note));
    }
}

export function setOverwriteCategoryName(id: String, name: string){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(set_overwrite_category_name(id, name));
    }
}

export function setOverwriteItemName(id: String, name: string){
    return (dispatch: Dispatch) => {
        dispatch(setOverwriteItemNamePrivate(id, name));
    }
}

export function setOverwriteNote(id: String, note: string){
    return (dispatch: Dispatch) => {
        dispatch(setOverwriteNotePrivate(id, note));
    }
}

export function removeAllImportTransactions(){
    return (dispatch: Dispatch) => {
        dispatch(removeAllImportTransactionsPrivate());
    }    
}

export function addImportTransaction(id: String, toImport: Boolean, dateId: String, categoryId: String, categoryName: String, itemId: String, itemName: String, day: Number, amount: String, note: string, overwriteCategoryName: String, overwriteItemName: string, overwriteNote: string){
    return (dispatch: Dispatch) => {
        dispatch(addImportTransactionPrivate(id, toImport, dateId, categoryId, categoryName, itemId, itemName, day, amount, note, overwriteCategoryName, overwriteItemName, overwriteNote));
    }
}