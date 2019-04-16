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

export function dateToReadble(dateId){
    var data = split(dateId);
    var month = data.month;
    var year = data.year;

    var readableMonth = "";
    switch(month){
        case "1":
            readableMonth = "january";
            break;
        case "2":
            readableMonth = "february";
            break;
        case "3":
            readableMonth = "march";
            break;
        case "4":
            readableMonth = "april";
            break;
        case "5":
            readableMonth = "may";
            break;
        case "6":
            readableMonth = "june";
            break;
        case "7":
            readableMonth = "july";
            break;
        case "8":
            readableMonth = "august";
            break;
        case "9":
            readableMonth = "september";
            break;
        case "10":
            readableMonth = "october";
            break;
        case "11":
            readableMonth = "november";
            break;
        case "12":
            readableMonth = "december";
            break;
        default:
            break;
    }

    return `${readableMonth} '${year.substring(2)}`;
}