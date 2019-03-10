var date: Date = (new Date());
var month: string = date.getMonth();
var year: string = date.getFullYear();

export const initialStore = {
    categories: [],
    items: [],
    transactions: [],
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
    //     amount: 0,
    //     note: ""
    //   }],
    date: {
        id: `${month}-${year}`,
        month: month,
        year: year
    }
}