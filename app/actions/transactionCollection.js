import { TRANSACTION_INITIAL_STATE } from "./transaction";
import { Dispatch } from "../reducers/types";

export const ADD_TRANSACTION = "ADD_TRANSACTION";

export const TRANSACTION_COLLECTION_INITIAL_STATE = [
    TRANSACTION_INITIAL_STATE
];

var add_transaction = function(){
    return {
        type: ADD_TRANSACTION,
        payload: {

        }
    };
}

export function addTransaction(){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(add_transaction());
    }
}