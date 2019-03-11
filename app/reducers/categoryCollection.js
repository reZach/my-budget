import {
    ADD_CATEGORY,
    REMOVE_CATEGORY,
    RENAME_CATEGORY,
    CATEGORY_COLLECTION_INITIAL_STATE
} from "../actions/categoryCollection";
import {
    Action,
    update
} from "./types";

export default function categoryCollection(state: any = CATEGORY_COLLECTION_INITIAL_STATE, action: Action) {
    switch (action.type) {
        case ADD_CATEGORY:
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
        case REMOVE_CATEGORY:
            return update([], state.filter(c => !(c.dateId === action.payload.dateId &&
                c.id === action.payload.categoryId)));
        case RENAME_CATEGORY:
            return update([], 
                state.map(c => {
                    if (c.dateId === action.payload.dateId &&
                        c.id === action.payload.categoryId){
                        c.name = action.payload.newName;
                    }

                    return c;
                })
            );
        default:
            return state;
    }
}