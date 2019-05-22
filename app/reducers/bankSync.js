import {
    ADD_BANK_SYNC_KEYS,
    // ENTRY_BANK_SYNC,
    BANK_SYNC_INITIAL_STATE
} from "../actions/bankSync";
import {
    Action,
    update
} from "./types";

export default function bankSync(state: Object = BANK_SYNC_INITIAL_STATE, action: Action){
    switch (action.type){
        case ADD_BANK_SYNC_KEYS:            
            return update(state, {
                clientId: action.payload.clientId,
                publicKey: action.payload.publicKey,
                development: action.payload.development
            });        
        default:
            return state;
    }
}