import {
    ADD_TRANSACTION,
    TRANSACTION_INITIAL_STATE
} from "../actions/transaction";
import {
    Action,
    update
} from "./types";


export default function transaction(state: any = TRANSACTION_INITIAL_STATE, action: Action) {
    switch (action.type){
        case ADD_TRANSACTION:
            // not used below
            if (state.length === 0) {
                return update(state,
                    [{
                        id: "1",
                        itemId: action.payload.itemId,
                        amount: action.payload.amount,
                        note: action.payload.note
                    }]
                );
            } else {
                return state;
            }        
        default:
            return state;
    }
}