import {
    ADD_ITEM,
    REMOVE_ITEM,
    RENAME_ITEM,
    ITEM_COLLECTION_INITIAL_STATE
} from "../actions/itemCollection";
import {
    Action,
    update
} from "./types";

export default function itemCollection(state: any = ITEM_COLLECTION_INITIAL_STATE, action: Action){
    switch (action.type){
        case ADD_ITEM:
            if (state.length === 0){
                return update(state,
                    [{
                        id: "1",
                        dateId: action.payload.dateId,
                        categoryId: action.payload.categoryId,
                        name: action.payload.name
                    }]
                );
            } else {
                return update(state,
                    [{
                        id: (state.filter(i => i.dateId === action.payload.dateId && i.categoryId === action.payload.categoryId).reduce((accumulator, current) => {
                            var id = parseInt(current.id);

                            if (id > accumulator) {
                                return id;
                            }

                            // Should never get into this, but still
                            return accumulator;
                        }, 0) + 1).toString(),
                        dateId: action.payload.dateId,
                        categoryId: action.payload.categoryId,
                        name: action.payload.name
                    }]
                );
            }
        case REMOVE_ITEM:
            return update([], state.filter(i => !(i.dateId === action.payload.dateId && i.categoryId === action.payload.categoryId && i.id === action.payload.id)));
        case RENAME_ITEM:
            return update([], 
                state.map(i => {
                    if (i.dateId === action.payload.dateId &&
                        i.categoryId === action.payload.categoryId &&
                        i.id === action.payload.id){
                        i.name = action.payload.newName;
                    }

                    return i;
                })
            );
        default:
            return state;
    }
}