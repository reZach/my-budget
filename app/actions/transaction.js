import { Store, Dispatch } from "../reducers/types";

export const ADD_TRANSACTION = "ADD_TRANSACTION";

export const TRANSACTION_INITIAL_STATE = {
    id: "",
    itemId: "",
    amount: 0,
    note: ""
};

var add_transaction = function(itemId: string, amount: number, note: string){
    return {
        type: ADD_TRANSACTION,
        payload: {
            itemId: itemId,
            amount: amount,
            note: note
        }
    }
}


export function addTransaction(itemId: string, amount: number, note: string){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(add_transaction(itemId, amount, note));
    }
}

