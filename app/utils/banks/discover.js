const puppeteer = require("puppeteer");

export async function navigate(username, password){
    return async function x(username, password){
        const browser = await puppeteer.launch({
            headless: false
        });
        const page = (await browser.pages())[0];
        await page.goto('https://www.discover.com');
        await page.click(".log-in-link[role='button']");
        await page.type("#userid", username);
        await page.type("#password", password);
        await page.click("#log-in-button");            
        await page.waitForNavigation();            
        await page.goto("https://card.discover.com/cardmembersvcs/statements/app/search");
        await page.click("#submit-trigger");
        await page.waitForNavigation();
    
        var transactions = await page.evaluate(function(){
            var raw = [];
            document.querySelectorAll("tr[id^=transaction-]")
                .forEach(function(current, index, list){
                    raw.push(current.innerHTML);
                }
            );
            return raw;
        });
        await browser.close();

        return parse(transactions);
    }(username, password);
}

var parse = function(raw){
    
    var actualTransactions = [];

    for (var i = 0; i < raw.length; i++){

        var date = raw[i].match(/(\d{2}\/\d{2}\/\d{2})<\/td>/);
        if (date.length !== 2) continue;

        var name = raw[i].match(/class="transaction-detail-toggler">([^<]+)/);
        if (name.length !== 2) continue;

        var category = raw[i].match(/<td class="ctg"[^>]+>(.+)<\/td>/);
        if (category.length !== 2) continue;

        var amount = raw[i].match(/<td class="amt">(\-?\$.+)<\/td>/);
        if (amount.length !== 2) continue;

        // date
        var split = date[1].split("/");

        actualTransactions.push({
            day: split[1],
            month: split[0],
            year: split[2],
            category: category[1],
            subcategory: "",
            amount: amount[1],
            note: name[1]
        });
    }

    return actualTransactions;
}