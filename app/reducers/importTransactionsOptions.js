import {
    SET_READY_TO_SET_CATEGORY_IDS,
    SET_READY_TO_CREATE_ITEMS,
    SET_READY_TO_SET_ITEM_IDS,
    SET_READY_TO_IMPORT,
    IMPORT_TRANSACTIONS_OPTIONS_INITIAL_STATE
} from "../actions/importTransactionsOptions";
import {
    Action,
    update
} from "./types";

export default function importTransactionsOptions(state: any = IMPORT_TRANSACTIONS_OPTIONS_INITIAL_STATE, action: Action){
    switch (action.type){
        case SET_READY_TO_SET_CATEGORY_IDS:
            return update(state, {
                readyToSetCategoryIds: action.payload.value
            });
        case SET_READY_TO_CREATE_ITEMS:
            return update(state, {
                readyToCreateItems: action.payload.value
            });
        case SET_READY_TO_SET_ITEM_IDS:
            return update(state, {
                readyToSetItemIds: action.payload.value
            });
        case SET_READY_TO_IMPORT:            
            return update(state, {
                readyToImport: action.payload.value
            });        
        default:
            return state;
    }
}