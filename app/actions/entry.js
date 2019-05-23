import { Dispatch } from "../reducers/types";

export const ENTRY_MODIFIED = "ENTRY_MODIFIED";
export const ENTRY_INCOME = "ENTRY_INCOME";
export const ENTRY_INCOME_RECORDS = "ENTRY_INCOME_RECORDS";
export const ENTRY_CATEGORIES = "ENTRY_CATEGORIES";
export const ENTRY_ITEMS = "ENTRY_ITEMS";
export const ENTRY_TRANSACTIONS = "ENTRY_TRANSACTIONS";


const entry_income = function(income: array){
    return {
        type: ENTRY_INCOME,
        payload: {
            income
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
const entry_items = function(items: array){
    return {
        type: ENTRY_ITEMS,
        payload: {
            items
        }
    };
}
const entry_transactions = function(transactions: array){
    return {
        type: ENTRY_TRANSACTIONS,
        payload: {
            transactions
        }
    };
}


export function entryIncome(income: array){
    return (dispatch: Dispatch) => {
        dispatch(entry_income(income));
    }
}
export function entryCategories(categories: array) {
    return (dispatch: Dispatch) => {
        dispatch(entry_categories(categories));
    }
}
export function exportItems(items: array){
    return (dispatch: Dispatch) => {
        dispatch(entry_items(items));
    }
}
export function exportTransactions(transactions: array){
    return (dispatch: Dispatch) => {
        dispatch(entry_transactions(transactions));
    }
}