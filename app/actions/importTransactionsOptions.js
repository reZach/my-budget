import { Dispatch } from "../reducers/types";

export const SET_READY_TO_SET_CATEGORY_IDS = "SET_READY_TO_SET_CATEGORY_IDS";
export const SET_READY_TO_CREATE_ITEMS = "SET_READY_TO_CREATE_ITEMS";
export const SET_READY_TO_SET_ITEM_IDS = "SET_READY_TO_SET_ITEM_IDS";
export const SET_READY_TO_IMPORT = "SET_READY_TO_IMPORT";

export const IMPORT_TRANSACTIONS_OPTIONS_INITIAL_STATE = {
    readyToSetCategoryIds: false,
    readyToCreateItems: false,
    readyToSetItemIds: false,
    readyToImport: false
};

const set_ready_to_set_category_ids = function(value: boolean){
    return {
        type: SET_READY_TO_SET_CATEGORY_IDS,
        payload: {
            value
        }
    };
}

const set_ready_to_create_items = function(value: boolean){
    return {
        type: SET_READY_TO_CREATE_ITEMS,
        payload: {
            value
        }
    };
}

const set_ready_to_set_item_ids = function(value: boolean){
    return {
        type: SET_READY_TO_SET_ITEM_IDS,
        payload: {
            value
        }
    };
}

const set_ready_to_import = function(value: boolean){
    return {
        type: SET_READY_TO_IMPORT,
        payload: {
            value
        }
    };
}

export function setReadyToSetCategoryIds(value: boolean){
    return (dispatch: Dispatch) => {
        dispatch(set_ready_to_set_category_ids(value));
    }
}

export function setReadyToCreateItems(value: boolean){
    return (dispatch: Dispatch) => {
        dispatch(set_ready_to_create_items(value));
    }
}

export function setReadyToSetItemIds(value: boolean){
    return (dispatch: Dispatch) => {
        dispatch(set_ready_to_set_item_ids(value));
    }
}

export function setReadyToImport(value: boolean) {
    return (dispatch: Dispatch) => {        
        dispatch(set_ready_to_import(value));        
    }
}
