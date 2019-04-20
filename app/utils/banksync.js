const crypto = require("crypto");
import { navigate as discover } from "../utils/banks/discover";

export async function bankSyncFetch(categories, items, bankName, username, password){

    var transactionLoad = [];

    switch (bankName){
        case "discover":
            transactionLoad = await discover(username, password);
            break;
        default:
            break;
    }

    console.warn(transactionLoad);

    return clean(transactionLoad, categories, items);
}

// cleans the input from the individual banks
var clean = function(transactions, categories, items){
    var cleaned = [];

    for (var i = 0; i < transactions.length; i++){        
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

var mapToCategory = function(transactions, categories){
    for (var i = 0; i < categories.length; i++){
        for (var j = 0; j < transactions.length; j++){
            if (categories[i].name === transactions[j].categoryName){
                transactions[j].categoryId = categories[i].id;
            }
        }                
    }
    return transactions;
}

var mapToSubcategory = function(transactions, items){
    for (var i = 0; i < items.length; i++){
        for (var j = 0; j < transactions.length; j++){
            if (items[i].name === transactions[j].itemName &&
                items[i].categoryId === transactions[j].categoryId){
                transactions[j].itemId = items[i].id;
            }
        }                
    }
    return transactions;
}

var stripLeading0 = function(input, toNumber){
    if (input.length <= 0) return input;

    if (input[0] === "0"){
        var modified = input.substring(1);

        if (toNumber){
            return parseInt(modified);
        } else {
            return modified;
        }
    } else {
        if (toNumber){
            return parseInt(input);
        } else {
            return input;
        }
    }
}

var cleanYear = function(year){
    if (typeof year === "string"){
        if (year.length === 2){
            return (new Date()).getFullYear().toString().substring(0, 2) + year;
        } else if (year.length === 4){
            return year;
        }
    } else if (typeof year === "number"){
        if (year < 100){
            return Math.floor(((new Date()).getFullYear() / 100)).toString() + year;
        } else if (year > 999){
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

//https://stackoverflow.com/a/55219682/1837080
var uuid = function(){
    let bytes = window.crypto.getRandomValues(new Uint8Array(32));
    const randomBytes = () => (bytes = bytes.slice(1)) && bytes[0];

    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => 
        (c ^ randomBytes() & 15 >> c / 4).toString(16)
    );
}