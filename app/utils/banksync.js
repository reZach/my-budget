import { navigate as discover } from "./banks/discover";

const crypto = require("crypto");

export async function bankSyncFetch(categories, items, bankName, username, password){

    let transactionLoad = [];

    switch (bankName){
        case "discover":
            transactionLoad = await discover(username, password);
            break;
        default:
            break;
    }

    return clean(transactionLoad, categories, items);
}

// cleans the input from the individual banks
var clean = function(transactions, categories, items){
    const cleaned = [];

    for (let i = 0; i < transactions.length; i++){        
        cleaned.push({
            tempId: uuid(),
            toImport: true,
            dateId: `${stripLeading0(transactions[i].month, false)}-${cleanYear(transactions[i].year)}`,
            categoryId: "",
            itemId: "",
            categoryName: cleanString(transactions[i].category),
            itemName: cleanString(transactions[i].subcategory),
            overwriteCategoryName: "",
            overwriteItemName: "",
            overwriteNote: "",
            day: stripLeading0(transactions[i].day, true),
            amount: cleanAmount(transactions[i].amount),
            note: cleanString(transactions[i].note)
        });
    }

    return cleaned;
}

var stripLeading0 = function(input, toNumber){
    if (input.length <= 0) return input;

    if (input[0] === "0"){
        const modified = input.substring(1);

        if (toNumber){
            return parseInt(modified);
        } 
            return modified;
        
    } 
        if (toNumber){
            return parseInt(input);
        } 
            return input;
        
    
}

var cleanYear = function(year){
    if (typeof year === "string"){
        if (year.length === 2){
            return (new Date()).getFullYear().toString().substring(0, 2) + year;
        } if (year.length === 4){
            return year;
        }
    } else if (typeof year === "number"){
        if (year < 100){
            return Math.floor(((new Date()).getFullYear() / 100)).toString() + year;
        } if (year > 999){
            return year.toString();
        }
    }

    return (new Date()).getFullYear();
}

var cleanString = function(input){
    return input
        .replace(/\r?\n/gm, "")
        .replace("&amp;", "&");
}

var cleanAmount = function(amount){
    return amount.replace("$", "");
}

// https://stackoverflow.com/a/55219682/1837080
var uuid = function(){
    let bytes = window.crypto.getRandomValues(new Uint8Array(32));
    const randomBytes = () => (bytes = bytes.slice(1)) && bytes[0];

    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => 
        (c ^ randomBytes() & 15 >> c / 4).toString(16)
    );
}