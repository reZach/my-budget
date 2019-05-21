import {
    ADD_TRANSACTION,
    REMOVE_TRANSACTION,
    REMOVE_ALL_TRANSACTION,
    ENTRY_TRANSACTIONS
} from "../actions/transactionCollection";
import {
    Action,
    update
} from "./types";

export default function transactionCollection(state: any = {}, action: Action){
    switch (action.type){
        case ADD_TRANSACTION:
            if (state.length === 0) {
                return update(state,
                    [{
                        id: "1",
                        dateId: action.payload.dateId,
                        categoryId: action.payload.categoryId,
                        itemId: action.payload.itemId,
                        day: action.payload.day,
                        amount: action.payload.amount,
                        note: action.payload.note
                    }]
                );
            } 
                return update(state,
                    [{
                        id: (state.filter(t => t.dateId === action.payload.dateId && t.categoryId === action.payload.categoryId && t.itemId === action.payload.itemId).reduce((accumulator, current) => {
                            const id = parseInt(current.id);

                            if (id > accumulator) {
                                return id;
                            }

                            // Should never get into this, but still
                            return accumulator;
                        }, 0) + 1).toString(),
                        dateId: action.payload.dateId,
                        categoryId: action.payload.categoryId,
                        itemId: action.payload.itemId,
                        day: action.payload.day,
                        amount: action.payload.amount,
                        note: action.payload.note
                    }]
                );
            
        case REMOVE_TRANSACTION:
            return update([], state.filter(t => !(t.dateId === action.payload.dateId && t.categoryId === action.payload.categoryId && t.itemId === action.payload.itemId && t.id === action.payload.transactionId)));
        case REMOVE_ALL_TRANSACTION:
            return update([], state.filter(t => t.dateId !== action.payload.dateId));
        case ENTRY_TRANSACTIONS:
            return update([], action.payload.transactions);
        default:
            return state;
    }
}