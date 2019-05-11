import { Dispatch, Store } from "../reducers/types";

export const ENTRY_MODIFIED = "ENTRY_MODIFIED";
export const ENTRY_INCOME = "ENTRY_INCOME";
export const ENTRY_INCOME_RECORDS = "ENTRY_INCOME_RECORDS";
export const ENTRY_CATEGORIES = "ENTRY_CATEGORIES";
export const ENTRY_ITEMS = "ENTRY_ITEMS";
export const ENTRY_TRANSACTIONS = "ENTRY_TRANSACTIONS";

var entry_modified = function(modified: any){
    return {
        type: ENTRY_MODIFIED,
        payload: {
            modified: modified
        }
    };
}
var entry_income = function(income: any){
    return {
        type: ENTRY_INCOME,
        payload: {
            income: income
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
var entry_items = function(items: any){
    return {
        type: ENTRY_ITEMS,
        payload: {
            items: items
        }
    };
}
var entry_transactions = function(transactions: any){
    return {
        type: ENTRY_TRANSACTIONS,
        payload: {
            transactions: transactions
        }
    };
}

export function entryModified(modified: any){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(entry_modified(modified));
    }
}
export function entryIncome(income: any){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(entry_income(income));
    }
}
export function entryCategories(categories: any) {
    return (dispatch: Dispatch, store: Store) => {
        dispatch(entry_categories(categories));
    }
}
export function exportItems(items: any){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(entry_items(items));
    }
}
export function exportTransactions(transactions: any){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(entry_transactions(transactions));
    }
}