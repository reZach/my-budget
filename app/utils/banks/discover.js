const puppeteer = require("puppeteer");

export async function fetch(username, password){
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
    console.error(raw);

    return 1;
}