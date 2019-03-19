import { CREATE_NEW_TRANSACTION_INITIAL_STATE } from "../actions/createTransaction";
let fs = require("fs");

var date: Date = (new Date());
var month: string = date.getMonth();
var year: string = date.getFullYear();

var success = false;
var fileContents;
try
{
    fileContents = JSON.parse(fs.readFileSync("./file.json", "utf-8"));
    success = true;
}
catch (error)
{

}

export const initialStore = {
    categories: success ? fileContents.categories : [],
    items: success ? fileContents.items : [],
    transactions: success ? fileContents.transactions : [],
    createTransaction: CREATE_NEW_TRANSACTION_INITIAL_STATE,
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
    date: success ? fileContents.date : {
        id: `${month}-${year}`,
        month: month,
        year: year
    }
}