import {
    ADD_CATEGORY,
    REMOVE_CATEGORY,
    RENAME_CATEGORY,
    SET_CATEGORY_SPENT,
    SET_COLLAPSE_CATEGORY,
    SET_COLLAPSE_CATEGORY_ALL,
    CATEGORY_COLLECTION_INITIAL_STATE,
    SORT_CATEGORIES_ALPHABETICALLY,
    SORT_CATEGORIES_REVERSE_ALPHABETICALLY,
    SORT_CATEGORIES_SPENT_DESCENDING,
    SORT_CATEGORIES_SPENT_ASCENDING,
    ENTRY_CATEGORIES
} from "../actions/categoryCollection";
import {
    Action,
    update
} from "./types";

export default function categoryCollection(state: array = CATEGORY_COLLECTION_INITIAL_STATE, action: Action) {
    switch (action.type) {
        case ADD_CATEGORY:
            if (state.length === 0) {
                return update(state,
                    [{
                        id: "1",
                        dateId: action.payload.dateId,
                        name: action.payload.name,
                        collapse: action.payload.collapse,
                        order: 1,
                        spent: 0
                    }]
                );
            } 
                return update(state,
                    [{
                        id: (state
                            .filter(c => c.dateId === action.payload.dateId)
                            .reduce((accumulator, current) => {
                                const id = parseInt(current.id);

                                if (id > accumulator) {
                                    return id;
                                }

                                // Should never get into this, but still
                                return accumulator;
                            }, 0) + 1).toString(),
                        dateId: action.payload.dateId,
                        name: action.payload.name,
                        collapse: action.payload.collapse,
                        order: action.payload.order,
                        spent: action.payload.spent
                    }]
                );
            
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
        case SET_CATEGORY_SPENT:            
            return update([],
                state.map(c => {
                    if (c.dateId === action.payload.dateId &&
                        c.id === action.payload.categoryId){
                            c.spent = action.payload.spent;
                    }

                    return c;
                })
            );
        case SET_COLLAPSE_CATEGORY:
            return update([], 
                state.map(c => {
                    if (c.dateId === action.payload.dateId &&
                        c.id === action.payload.categoryId){
                            c.collapse = action.payload.collapse;
                    }

                    return c;
                })
            );
        case SET_COLLAPSE_CATEGORY_ALL:
            return update([], 
                state.map(c => {
                    if (c.dateId === action.payload.dateId){
                        c.collapse = action.payload.collapse;
                    }
                    
                    return c;
                })
            );
        case SORT_CATEGORIES_ALPHABETICALLY:
            return update([],
                state.sort((a, b) => {
                    if (a.name > b.name){
                        return 1;
                    } if (b.name > a.name){
                        return -1;
                    }
                    return 0;
                })
                .map((c, index) => {
                    if (c.dateId === action.payload.dateId){
                        c.order = (index + 1);
                    }
                    return c;
                })
            );
        case SORT_CATEGORIES_REVERSE_ALPHABETICALLY:
            return update([],
                state.sort((a, b) => {
                    if (a.name > b.name){
                        return -1;
                    } if (b.name > a.name){
                        return 1;
                    }
                    return 0;
                })
                .map((c, index) => {
                    if (c.dateId === action.payload.dateId){
                        c.order = (index + 1);
                    }
                    return c;
                })
            );
        case SORT_CATEGORIES_SPENT_DESCENDING:
            return update([],
                state.sort((a, b) => {
                    const d1 = a.dateId;
                    const d2 = b.dateId;
                    const a1 = parseFloat(a.spent);
                    const a2 = parseFloat(b.spent);
                    const split1 = d1.split("-");
                    const split2 = d2.split("-");
                    const m1 = split1[0];
                    const y1 = split1[1];
                    const m2 = split2[0];
                    const y2 = split2[1];

                    // sort by dateid first
                    if (y1 > y2){
                        return 1;
                    } if (y2 > y1){
                        return -1;
                    } if (m1 > m2) {
                        return 1;
                    } if (m2 > m1) {
                        return -1;
                    } if (a1 > a2) { // have same date id at this point
                        return -1;
                    } if (a2 > a1) {
                        return 1;
                    }
                    return 0;
                })
                .map((c, index) => {
                    c.order = (index + 1);
                    return c;
                })
            );
        case SORT_CATEGORIES_SPENT_ASCENDING:
            return update([],
                state.sort((a, b) => {
                    const d1 = a.dateId;
                    const d2 = b.dateId;
                    const a1 = parseFloat(a.spent);
                    const a2 = parseFloat(b.spent);
                    const split1 = d1.split("-");
                    const split2 = d2.split("-");
                    const m1 = split1[0];
                    const y1 = split1[1];
                    const m2 = split2[0];
                    const y2 = split2[1];

                    // sort by dateid first
                    if (y1 > y2){
                        return 1;
                    } if (y2 > y1){
                        return -1;
                    } if (m1 > m2) {
                        return 1;
                    } if (m2 > m1) {
                        return -1;
                    } if (a1 > a2) { // have same date id at this point
                        return 1;
                    } if (a2 > a1) {
                        return -1;
                    }
                    return 0;
                })
                .map((c, index) => {
                    if (c.dateId === action.payload.dateId){
                        c.order = (index + 1);
                    }                    
                    return c;
                })
            );
        case ENTRY_CATEGORIES:
            return update([], action.payload.categories);
        default:
            return state;
    }
}