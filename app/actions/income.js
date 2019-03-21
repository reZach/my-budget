import { Store, Dispatch } from "../reducers/types";

export const SAVE_INCOME = "SAVE_INCOME";

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

export function saveIncome(amount: number){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(save_income(store().date.id, amount));
    }
}