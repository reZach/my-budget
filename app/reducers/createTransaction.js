import {
    CREATE_NEW_TRANSACTION,
    CREATE_NEW_TRANSACTION_INITIAL_STATE,
    RESET_CREATE_NEW_TRANSACTION,
    MODIFY_NOTE,
    MODIFY_AMOUNT,
    MODIFY_DAY,
    MODIFY_SELECTED_CATEGORY,
    MODIFY_SELECTED_ITEM
} from "../actions/createTransaction";
import {
    Action,
    update
} from "./types";

export default function createTransaction(state: object = CREATE_NEW_TRANSACTION_INITIAL_STATE, action: Action){
    switch (action.type){
        case CREATE_NEW_TRANSACTION:            
            if (state.length === 0) {
                return update(state,
                    [{
                        id: "1",
                        dateId: action.payload.dateId,
                        categoryId: action.payload.categoryId,
                        itemId: action.payload.itemId,
                        day: action.payload.day,
                        amount: action.payload.amount,
                        note: action.payload.amount
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
            
        case RESET_CREATE_NEW_TRANSACTION:
            return update(state, {
                amount: "",
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
        case MODIFY_SELECTED_CATEGORY:
            return update(state, {
                selectedCategoryId: action.payload.categoryId,
                selectedCategory: action.payload.categoryName
            });
        case MODIFY_SELECTED_ITEM:
            return update(state, {
                selectedItemId: action.payload.itemId,
                selectedItem: action.payload.itemName
            });
        default:
            return state;
    }
}