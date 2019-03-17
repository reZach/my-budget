import { CREATE_NEW_TRANSACTION_INITIAL_STATE } from "../actions/createTransaction";

var date: Date = (new Date());
var month: string = date.getMonth();
var year: string = date.getFullYear();

export const initialStore = {
    categories: [],
    items: [],
    transactions: [],
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
    date: {
        id: `${month}-${year}`,
        month: month,
        year: year
    }
}