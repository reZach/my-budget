import { CATEGORY_INITIAL_STATE } from "./category";
import { addTransaction } from "./transactionCollection";
import { Store, Dispatch } from "../reducers/types";

export const CREATE_NEW_TRANSACTION = "CREATE_NEW_TRANSACTION";
export const RESET_CREATE_NEW_TRANSACTION = "RESET_CREATE_NEW_TRANSACTION";
export const MODIFY_NOTE = "MODIFY_NOTE";
export const MODIFY_AMOUNT = "MODIFY_AMOUNT";
export const MODIFY_DAY = "MODIFY_DAY";

export const CREATE_NEW_TRANSACTION_INITIAL_STATE = {
    selectedCategoryId: "",
    selectedItemId: "",
    day: 1,
    amount: 0,
    note: ""
};

var reset_create_new_transaction = function(){
    return {
        type: RESET_CREATE_NEW_TRANSACTION,
        payload: {            
            amount: 0,
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
        dispatch(modify_day(day));
    }
}