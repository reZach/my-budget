import { Store, Dispatch } from "../reducers/types";

export const SAVE_INCOME = "SAVE_INCOME";
export const ENTRY_INCOME = "ENTRY_INCOME";

export const INCOME_INITIAL_STATE = [{
    id: "",
    dateId: "",
    income: 0
}];

const saveIncomePrivate = function saveIncomePrivate(dateId: string, amount: number){
    return {
        type: SAVE_INCOME,
        payload: {
            dateId,
            amount
        }
    }
}
const entryIncomePrivate = function entryIncomePrivate(income: any){
    return {
        type: ENTRY_INCOME,
        payload: {
            income
        }
    };
}

export function saveIncome(amount: number){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(saveIncomePrivate(store().date.id, amount));
    }
}
export function entryIncome(income: any){
    return (dispatch: Dispatch) => {
        dispatch(entryIncomePrivate(income));
    }
}