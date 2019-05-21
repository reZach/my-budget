import { Store, Dispatch } from "../reducers/types";

export const TRUE = "TRUE";
export const FALSE = "FALSE";



const truePrivate = function truePrivate(){
    return {
        type: TRUE,
        payload: {}        
    };
}
const falsePrivate = function falsePrivate(){
    return {
        type: FALSE,
        payload: {}        
    };
}


// Sets the app to modified; must save changes
export function trueModify() {
    return (dispatch: Dispatch) => {
        dispatch(truePrivate());
    }
}

// Sets the app to no pending changes present
export function falseModify() {
    return (dispatch: Dispatch) => {
        dispatch(falsePrivate());
    }
}