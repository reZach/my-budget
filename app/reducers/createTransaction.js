import {
    CREATE_NEW_TRANSACTION,
    CREATE_NEW_TRANSACTION_INITIAL_STATE,
    RESET_CREATE_NEW_TRANSACTION,
    MODIFY_NOTE,
    MODIFY_AMOUNT,
    MODIFY_DAY
} from "../actions/createTransaction";
import {
    Action,
    update
} from "./types";

export default function createTransaction(state: any = CREATE_NEW_TRANSACTION_INITIAL_STATE, action: Action){
    switch (action.type){
        case CREATE_NEW_TRANSACTION:
            // UPDATE THE BELOW
            if (state.length === 0) {
                return update(state,
                    [{
                        id: "1",
                        dateId: action.payload.dateId,
                        name: action.payload.name
                    }]
                );
            } else {
                return update(state,
                    [{
                        id: (state
                            .filter(c => c.dateId === action.payload.dateId)
                            .reduce((accumulator, current) => {
                                var id = parseInt(current.id);

                                if (id > accumulator) {
                                    return id;
                                }

                                // Should never get into this, but still
                                return accumulator;
                            }, 0) + 1).toString(),
                        dateId: action.payload.dateId,
                        name: action.payload.name
                    }]
                );
            }
        case RESET_CREATE_NEW_TRANSACTION:
            return update(state, {
                amount: 0,
                note: ""
            });
        case MODIFY_NOTE:
            return update(state, {
                note: action.payload.note
            });
        case MODIFY_AMOUNT:
            return update(state, {
                amount: action.payload.amount
            });
        case MODIFY_DAY:
            return update(state, {
                day: action.payload.day
            });
        default:
            return state;
    }
}