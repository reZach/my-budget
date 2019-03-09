import { CATEGORY_COLLECTION_INITIAL_STATE } from "../actions/categoryCollection";
import { Action, update } from "./types";

export default function categoryCollection(state: any = CATEGORY_COLLECTION_INITIAL_STATE, action: Action) {
    switch (action.type){
        default:
            return state;
    }
}