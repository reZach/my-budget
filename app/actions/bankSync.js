import { Store, Dispatch } from "../reducers/types";

export const ADD_BANK_SYNC_KEYS = "ADD_BANK_SYNC_KEYS";
export const ENTRY_BANK_SYNC = "ENTRY_BANK_SYNC";

export const BANK_SYNC_INITIAL_STATE = {
    clientId: "",
    publicKey: "",
    development: ""
}

const addBankSyncKeysPrivate = function addBankSyncKeysPrivate(clientId: string, publicKey: string, development: string){
    return {
        type: ADD_BANK_SYNC_KEYS,
        payload: {
            clientId,
            publicKey,
            development
        }
    };
}

export function addBankSyncKeys(clientId: string, publicKey: string, development: string){
    return (dispatch: Dispatch) => {
        dispatch(addBankSyncKeysPrivate(clientId, publicKey, development));
    }
}

export function entryBankSyncKeys(clientId: string, publicKey: string, development: string){
    return (dispatch: Dispatch) => {
        dispatch(addBankSyncKeysPrivate(clientId, publicKey, development));
    }
}