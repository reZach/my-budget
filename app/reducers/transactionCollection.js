import {
    ADD_TRANSACTION
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
            } else {
                return update(state,
                    [{
                        id: (state.filter(t => t.dateId === action.payload.dateId && t.categoryId === action.payload.categoryId && t.itemId === action.payload.itemId).reduce((accumulator, current) => {
                            var id = parseInt(current.id);

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
            }
        default:
            return state;
    }
}