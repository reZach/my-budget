import { CREATE_NEW_TRANSACTION_INITIAL_STATE } from "../actions/createTransaction";
import { BANK_SYNC_INITIAL_STATE } from "../actions/bankSync";

// let fs = require("fs");
// import * as crypto from "../crypto/code";

var date: Date = (new Date());
var month: string = date.getMonth() + 1;
var year: string = date.getFullYear();

// var success = false;
// var fileContents;
// try
// {
//     fileContents = fs.readFileSync("file.json", "utf-8");

//     if (crypto.cryptoAvailable()){
//         var decrypted = crypto.decrypt(fileContents);

//         success = true;
//         fileContents = JSON.parse(decrypted);
//     } else {
//         success = true;
//         fileContents = JSON.parse(fileContents);
//     }
// }
// catch (error)
// {
//     console.error(error);
// }

export const initialStore = {
    modified: /*success ? fileContents.modified :*/ false,
    income: /*success ? fileContents.income :*/ [{
        id: "1",
        dateId: `${month}-${year}`,
        amount: 0
    }],
    categories: /*success ? fileContents.categories :*/ [],
    items: /*success ? fileContents.items :*/ [],
    transactions: /*success ? fileContents.transactions :*/ [],
    createTransaction: CREATE_NEW_TRANSACTION_INITIAL_STATE,
    bankSync: BANK_SYNC_INITIAL_STATE,
    //templates: [],
    //   income: [{
    //       id: "",
    //       dateId: "",
    //       income: 0
    //   }],
    //   categories: [{
    //     id: "",
    //     dateId: "",
    //     name: ""
    //   }],
    //   items: [{
    //     id: "",
    //     dateId: "",
    //     categoryId: "",
    //     name: ""
    //   }],
    //   transactions: [{
    //     id: "",
    //     dateId: "",
    //     categoryId: "",
    //     itemId: "",
    //     day: 0,
    //     amount: 0,
    //     note: ""    
    //   }],
    //   createTransaction: {
    //       selectedCategoryId: "",
    //       selectedItemId: "",
    //       day: 1,
    //       amount: 0,
    //       note: ""
    //   }
    //   bankSync: {
    //       clientId: "",
    //       publicKey: "",
    //       development: ""
    //   }
    date: /*success ? fileContents.date :*/ {
        id: `${month}-${year}`,
        month: month,
        year: year
    }
}