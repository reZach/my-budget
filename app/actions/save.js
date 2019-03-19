import { Store, Dispatch } from "../reducers/types";
let fs = require("fs");

export const SAVE = "SAVE";

var _save = function(){
    return {
        type: SAVE,
        payload: {}
    };
}

export function save(){
    return (dispatch: Dispatch, store: Store) => {
        fs.writeFile("./file.json", JSON.stringify(store()), "utf-8", (error, data) => {
            if (error){
                console.error("Could not write file: " + error.message);
                return;
            }
            console.log("saved data");
            dispatch(_save());
        });
    }
}