import {
    SAVE_INCOME,
    ENTRY_INCOME
} from "../actions/income";
import {
    Action,
    update
} from "./types";

export default function income(state: Array = [], action: Action) {
    switch (action.type) {
        case SAVE_INCOME:
            var index = state.find(i => i.dateId === action.payload.dateId);

            if (typeof index === "undefined") {

                // Add into state
                return update(state,
                    [{
                        id: (state
                            .filter(i => i.dateId === action.payload.dateId)
                            .reduce((accumulator, current) => {
                                const id = parseInt(current.id);

                                if (id > accumulator) {
                                    return id;
                                }

                                // Should never get into this, but still
                                return accumulator;
                            }, 0) + 1).toString(),
                        dateId: action.payload.dateId,
                        amount: action.payload.amount
                    }]
                );
            }

            // Update existing
            return update([],
                state.map(i => {
                    if (i.dateId === action.payload.dateId) {
                        i.amount = action.payload.amount;
                    }

                    return i;
                })
            );

        case ENTRY_INCOME:
            return update([], action.payload.income);
        default:
            return state;
    }
}