import { TRANSACTION_INITIAL_STATE } from "./transaction";
import { Dispatch } from "../reducers/types";
import { recalculateCategorySpent } from "./categoryCollection";

export const ADD_TRANSACTION = "ADD_TRANSACTION";
export const REMOVE_TRANSACTION = "REMOVE_TRANSACTION";
export const REMOVE_ALL_TRANSACTION = "REMOVE_ALL_TRANSACTION";
export const ENTRY_TRANSACTIONS = "ENTRY_TRANSACTIONS";

export const TRANSACTION_COLLECTION_INITIAL_STATE = [
    TRANSACTION_INITIAL_STATE
];



var add_transaction = function(dateId: string, categoryId: string, itemId: string, day: string, amount: string, note: string){
    return {
        type: ADD_TRANSACTION,
        payload: {
            dateId: dateId,
            categoryId: categoryId,
            itemId: itemId,
            day: day,
            amount: amount,
            note: note
        }
    };
}
var remove_transaction = function(dateId: string, categoryId: string, itemId: string, transactionId: string){
    return {
        type: REMOVE_TRANSACTION,
        payload: {
            dateId: dateId,
            categoryId: categoryId,
            itemId: itemId,
            transactionId: transactionId
        }
    }
}
var remove_all_transactions = function(dateId: string){
    return {
        type: REMOVE_ALL_TRANSACTION,
        payload: {
            dateId: dateId
        }
    }
}
var entry_transactions = function(transactions: any){
    return {
        type: ENTRY_TRANSACTIONS,
        payload: {
            transactions: transactions
        }
    };
}

export function addTransaction(categoryId: string, itemId: string, day: string, amount: string, note: string){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(add_transaction(
            store().date.id, categoryId, itemId, day, amount, note));            
        recalculateCategorySpent(store().date.id, categoryId);
    }
}
export function addTransaction2(dateId: string, categoryId: string, itemId: string, day: string, amount: string, note: string){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(add_transaction(
            dateId, categoryId, itemId, day, amount, note));
        recalculateCategorySpent(dateId, categoryId);
    }
}
export function removeTransaction(categoryId: string, itemId: string, transactionId: string){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(remove_transaction(store().date.id, categoryId, itemId, transactionId));
        recalculateCategorySpent(store().date.id, categoryId);
    }
}
export function removeAllTransactions(){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(remove_all_transactions(store().date.id));
    }
}
export function entryTransactions(transactions: any){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(entry_transactions(transactions));

        for(var i = 0; i < transactions.length; i++){
            recalculateCategorySpent(transactions[i].dateId, transactions[i].categoryId);
        }
    }
}