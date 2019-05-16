var split = function(dateId){
    var split = "";

    // if passing date object in
    if (typeof dateId["id"] !== "undefined" && dateId["id"].length > 0){
        split = dateId.id.split("-");
    } else if (dateId.length > 0){
        // if passing in dateId string
        split = dateId.split("-");
    }

    return {
        month: split[0],
        year: split[1]
    }
}

export function dateMatches(dateId){
    var data = split(dateId);

    var today = (new Date());
    var month = today.getMonth() + 1;
    var year = today.getFullYear();

    return data.month == month && data.year == year; 
}

export function dateToShort(dateId){
    var data = split(dateId);
    var month = data.month;
    var year = data.year;

    return `${month}/${year.substring(0,1)}`;
}

export function dateToMMDDYYYY(month, day, year){
    return `${month}/${day}/${year}`;
}

export function dateToReadble(dateId){
    var data = split(dateId);
    var month = data.month;
    var year = data.year;

    var readableMonth = "";
    switch(month){
        case "1":
            readableMonth = "January";
            break;
        case "2":
            readableMonth = "February";
            break;
        case "3":
            readableMonth = "March";
            break;
        case "4":
            readableMonth = "April";
            break;
        case "5":
            readableMonth = "May";
            break;
        case "6":
            readableMonth = "June";
            break;
        case "7":
            readableMonth = "July";
            break;
        case "8":
            readableMonth = "August";
            break;
        case "9":
            readableMonth = "September";
            break;
        case "10":
            readableMonth = "October";
            break;
        case "11":
            readableMonth = "November";
            break;
        case "12":
            readableMonth = "December";
            break;
        default:
            break;
    }

    return `${readableMonth} '${year.substring(2)}`;
}