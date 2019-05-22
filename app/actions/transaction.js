import { Dispatch } from "../reducers/types";

export const ADD_TRANSACTION = "ADD_TRANSACTION";

export const TRANSACTION_INITIAL_STATE = {
    id: "",
    itemId: "",
    amount: 0,
    note: ""
};

const addTransactionPrivate = function addTransactionPrivate(itemId: string, amount: number, note: string){
    return {
        type: ADD_TRANSACTION,
        payload: {
            itemId,
            amount,
            note
        }
    }
}


export function addTransaction(itemId: string, amount: number, note: string){
    return (dispatch: Dispatch) => {
        dispatch(addTransactionPrivate(itemId, amount, note));
    }
}

