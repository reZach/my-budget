import { Store, Dispatch } from "../reducers/types";
import { falseModify } from "./modify";
import * as crypto from "../crypto/code";
import filehelper from "../utils/filehelper";
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
        
        let encrypted = "";

        if (store().passphrase !== ""){
            encrypted = crypto.encrypt(JSON.stringify(store()), store().passphrase);
        } else {
            encrypted = JSON.stringify(store());
        }

        filehelper.set(encrypted, (error, data) => {
            if (error){
                alert("Could not write file: " + error.message);
                return;
            }
            console.log("saved data");
            dispatch(_save());
        });
    }
}

export function deleteAll(suppress = false){
    return (dispatch: Dispatch, store: Store) => {

        filehelper.set("", (error, data) => {
            if (error){
                if (!suppress){
                    alert("Could not delete data: " + error.message);
                }
                
                return;
            } else {
                console.log("deleted all data");

                if (!suppress){
                    alert("deleted all data, please close and re-open this app.");
                }                
            }
        });
    }
}