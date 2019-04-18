import { addTransaction2 } from "../actions/transactionCollection";
import { navigate as discover } from "../utils/banks/discover";

export async function bankSyncFetch(bankName, username, password){

    var transactionLoad = [];

    switch (bankName){
        case "discover":
            transactionLoad = await discover(username, password);
            break;
        default:
            break;
    }

    console.warn(transactionLoad);
    // hm?
    // for (var i = 0; i < transactionLoad.length; i++){
        
    // }

    return transactionLoad;
}