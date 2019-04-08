import { Dispatch, Store } from "../reducers/types";
const crypto = require("crypto");

export const SET_PASSPHRASE = "SET_PASSPHRASE";

var set_passphrase = function(passphrase: string){
    return {
        type: SET_PASSPHRASE,
        payload: {
            passphrase: passphrase
        }
    };
}

export function setPassphrase(passphrase: string){
    return (dispatch: Dispatch, store: Store) => {

        let hash = "";

        if (passphrase !== ""){
            hash = crypto.createHash("sha256").update(passphrase, "utf8").digest();
        }        

        dispatch(set_passphrase(hash));
    }
}