import {
    MODIFY_IMPORT_CHECKBOX,
    MODIFY_ALL_IMPORT_CHECKBOX,
    ADD_IMPORT_TRANSACTION,
    REMOVE_ALL_IMPORT_TRANSACTIONS,
    SORT_IMPORT_TRANSACTIONS,
    SET_CATEGORY_ID,
    SET_ITEM_ID,
    SET_NOTE,
    SET_OVERWRITE_CATEGORY_NAME,
    SET_OVERWRITE_ITEM_NAME,
    SET_OVERWRITE_NOTE    
} from "../actions/pendingImport";
import update, {
    Action
} from "./types";

export default function pendingImport(state: array = [], action: Action){
    switch (action.type){
        case ADD_IMPORT_TRANSACTION:        
            return update(state, [{
                tempId: action.payload.id,
                toImport: action.payload.toImport,
                dateId: action.payload.dateId,
                categoryId: action.payload.categoryId,
                itemId: action.payload.itemId,
                categoryName: action.payload.categoryName,
                itemName: action.payload.itemName,
                day: action.payload.day,
                amount: action.payload.amount,
                note: action.payload.note,
                overwriteCategoryName: action.payload.overwriteCategoryName,
                overwriteItemName: action.payload.overwriteItemName,
                overwriteNote: action.payload.overwriteNote
            }])
        case REMOVE_ALL_IMPORT_TRANSACTIONS:
            return [];
        case MODIFY_IMPORT_CHECKBOX:  
            return update([], 
                state.map(t => {
                    if (t.tempId === action.payload.id){                        
                        t.toImport = action.payload.value;
                    }

                    return t;
                })
            );
        case MODIFY_ALL_IMPORT_CHECKBOX:
            return update([], 
                state.map(t => {
                    t.toImport = action.payload.value;

                    return t;
                })
            );
        case SORT_IMPORT_TRANSACTIONS:
            return state.sort((a, b) => {
                                                        
                const split1 = a.dateId.split('-');
                const split2 = b.dateId.split('-');
                const m1 = split1[0];
                const d1 = a.day;
                const y1 = split1[1];
                const m2 = split2[0];
                const d2 = b.day
                const y2 = split2[1];
    
                if (y1 > y2){
                    return 1;
                } if (y2 > y1) {
                    return -1;
                } if (m1 > m2) {
                    return 1;
                } if (m2 > m1) {
                    return -1;
                } if (d1 > d2) {
                    return 1;
                } if (d2 > d1) {
                    return -1;
                }
                return 0;
            });
        case SET_CATEGORY_ID:
            return update([], 
                state.map(t => {
                    if (t.tempId === action.payload.id){
                        t.categoryId = action.payload.categoryId;
                    }

                    return t;
                })
            );   
        case SET_ITEM_ID:
            return update([], 
                state.map(t => {
                    if (t.tempId === action.payload.id){
                        t.itemId = action.payload.itemId;
                    }

                    return t;
                })
            );
        case SET_NOTE:
            return update([], 
                state.map(t => {
                    if (t.tempId === action.payload.id){
                        t.note = action.payload.note;
                    }

                    return t;
                })
            );            
        case SET_OVERWRITE_CATEGORY_NAME:
            return update([], 
                state.map(t => {
                    if (t.tempId === action.payload.id){
                        t.overwriteCategoryName = action.payload.name;
                    }

                    return t;
                })
            );
        case SET_OVERWRITE_ITEM_NAME:
            return update([], 
                state.map(t => {
                    if (t.tempId === action.payload.id){
                        t.overwriteItemName = action.payload.name;
                    }

                    return t;
                })
            );
        case SET_OVERWRITE_NOTE:
            return update([], 
                state.map(t => {
                    if (t.tempId === action.payload.id){
                        t.overwriteNote = action.payload.note;
                    }

                    return t;
                })
            );
        default:
            return state;
    }
}