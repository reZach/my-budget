import { CATEGORY_INITIAL_STATE } from "./category";
import { addTransaction } from "./transactionCollection";
import { Store, Dispatch } from "../reducers/types";

export const CREATE_NEW_TRANSACTION = "CREATE_NEW_TRANSACTION";
export const RESET_CREATE_NEW_TRANSACTION = "RESET_CREATE_NEW_TRANSACTION";
export const MODIFY_NOTE = "MODIFY_NOTE";
export const MODIFY_AMOUNT = "MODIFY_AMOUNT";
export const MODIFY_DAY = "MODIFY_DAY";
export const MODIFY_SELECTED_CATEGORY = "MODIFY_SELECTED_CATEGORY";
export const MODIFY_SELECTED_ITEM = "MODIFY_SELECTED_ITEM";

export const CREATE_NEW_TRANSACTION_INITIAL_STATE = {
    selectedCategoryId: "",
    selectedItemId: "",
    day: (new Date()).getDate(),
    amount: "",
    note: ""
};

var reset_create_new_transaction = function(){
    return {
        type: RESET_CREATE_NEW_TRANSACTION,
        payload: {            
            amount: "",
            note: ""
        }
    };
}
var modify_note = function(note: string){
    return {
        type: MODIFY_NOTE,
        payload: {
            note: note
        }
    };
}
var modify_amount = function(amount: number){
    return {
        type: MODIFY_AMOUNT,
        payload: {
            amount: amount
        }
    };
}
var modify_day = function(day: number){
    return {
        type: MODIFY_DAY,
        payload: {
            day: day
        }
    };
}
var modify_selected_category = function(categoryId: string, categoryName: string){
    return {
        type: MODIFY_SELECTED_CATEGORY,
        payload: {
            categoryId: categoryId,
            categoryName: categoryName
        }
    };
}
var modify_selected_item = function(itemId: string, itemName: string){
    return {
        type: MODIFY_SELECTED_ITEM,
        payload: {
            itemId: itemId,
            itemName: itemName
        }
    };
}

export function createNewTransaction(categoryId: string, itemId: string, day: number, amount: number, note: string) {
    return (dispatch: Dispatch, store: Store) => {
        addTransaction(
            store().date.id, categoryId, itemId, day, amount, note);
        dispatch(reset_create_new_transaction());        
    }
}
export function resetCreateNewTransaction(){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(reset_create_new_transaction());
    }
}
export function modifyNote(note: string){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(modify_note(note));
    }
}
export function modifyAmount(amount: number){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(modify_amount(amount));
    }
}
export function modifyDay(day: number){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(modify_day(parseInt(day)));
    }
}
export function modifySelectedCategory(categoryId: string, categoryName: string){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(modify_selected_category(categoryId, categoryName));
    }
}
export function modifySelectedItem(itemId: string, itemName: string){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(modify_selected_item(itemId, itemName));
    }
}