import {
    ADD_CATEGORY,
    REMOVE_CATEGORY,
    RENAME_CATEGORY,
    ADD_CATEGORY_ITEM,
    REMOVE_CATEGORY_ITEM,
    RENAME_CATEGORY_ITEM,
    CATEGORY_INITIAL_STATE
} from "../actions/category";
import {
    Action,
    update
} from "./types";
import {
    Store as store
} from "../reducers/types";



export default function category(state: any = CATEGORY_INITIAL_STATE, action: Action) {
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
                        id: state
                            .filter(c => c.dateId === action.payload.dateId)
                            .reduce(function(accumulator, current = "0") {
                                return accumulator + parseInt(current.id);
                            }).toString(),
                        dateId: action.payload.dateId,
                        name: action.payload.name
                    }]
                );
            }
            // case REMOVE_CATEGORY:
            //     return update(state, {
            //         items: state.items.filter(e => e.name !== action.payload.name)
            //     })
            // case RENAME_CATEGORY:
            //   return update(state, {
            //     categories: state.categories.map((item, index) => {
            //       if (item.dateId === action.payload.dateId) {
            //         item.name = 
            //       }

            //       return item;
            //     })
            //   });
        default:
            return state;
    }
}