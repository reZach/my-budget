import { Store, Dispatch } from "../reducers/types";
import { falseModify } from "./modify";
import * as crypto from "../crypto/code";
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

        // reset key + iv
        crypto.writeNewIv();
        crypto.writeNewKey();
        
        let encrypted = crypto.encrypt(JSON.stringify(store()));
        fs.writeFile("./file.json", encrypted, "utf-8", (error, data) => {
            if (error){
                alert("Could not write file: " + error.message);
                return;
            }
            console.log("saved data");
            dispatch(_save());
        });
    }
}

export function deleteAll(){
    return (dispatch: Dispatch, store: Store) => {
        fs.writeFile("./file.json", "", "utf-8", (error, data) => {
            if (error){
                alert("Could not delete data: " + error.message);
                return;
            } else {
                console.log("deleted all data");
                alert("deleted all data, please close and re-open this app.");
            }            
        })
    }
}