import { Store, Dispatch } from "../reducers/types";

export const TRUE = "TRUE";
export const FALSE = "FALSE";



var _true = function(){
    return {
        type: TRUE,
        payload: {}        
    };
}
var _false = function(){
    return {
        type: FALSE,
        payload: {}        
    };
}



export function trueModify() {
    return (dispatch: Dispatch) => {
        dispatch(_true());
    }
}

export function falseModify() {
    return (dispatch: Dispatch) => {
        dispatch(_false());
    }
}