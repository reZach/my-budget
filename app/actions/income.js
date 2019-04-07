import { Store, Dispatch } from "../reducers/types";

export const SAVE_INCOME = "SAVE_INCOME";
export const ENTRY_INCOME = "ENTRY_INCOME";

export const INCOME_INITIAL_STATE = [{
    id: "",
    dateId: "",
    income: 0
}];

var save_income = function(dateId: string, amount: number){
    return {
        type: SAVE_INCOME,
        payload: {
            dateId: dateId,
            amount: amount
        }
    }
}
var entry_income = function(income: any){
    return {
        type: ENTRY_INCOME,
        payload: {
            income: income
        }
    };
}

export function saveIncome(amount: number){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(save_income(store().date.id, amount));
    }
}
export function entryIncome(income: any){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(entry_income(income));
    }
}