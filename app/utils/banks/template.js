// For an example of how to write a connector,
// please visit: https://github.com/reZach/my-budget/wiki/Creating-a-new-connector
const puppeteer = require("puppeteer");

export async function navigate(username, password){
    return async function x(username, password){
        const browser = await puppeteer.launch({
            headless: false
        });
        const page = (await browser.pages())[0];

        // Here you will put the steps that
        // 1. navigate you to the bank's website
        // 2. log you in
        // 3. navigate to the page that displays transaction data
        // 4. scrapes website data with css selectors
        // 5. close the puppeteer instance

        // Here are sample code snippets you can use
        // while writing your connector

        /*
            // Takes you to "https://www.discover.com"    
            await page.goto('https://www.discover.com');

            // Enters in a value in the <input> with id of "userid"
            await page.type("#userid", username);

            // Enters in a value in the <input> with id of "password"
            await page.type("#password", password);

            // Clicks the log in button with the id of "log-in-button"
            await page.click("#log-in-button");

            // Necessary to call to ensure the page has finished
            // loading before taking the next step
            await page.waitForNavigation();
        */
    
        const transactions = await page.evaluate(() => {
            const raw = [];

            // Here we are querying all <tr> elements with an id
            // that begins with "transaction-". We save all of the
            // inner HTML (this HTML contains our transaction data).

            // It is very likely that this css selector will not
            // work for your use case and will need to be modified!
            document.querySelectorAll("tr[id^=transaction-]")
                .forEach((current, index, list) => {
                    raw.push(current.innerHTML);
                }
            );
            return raw;
        });

        // These two lines below are necessary,
        // DO NOT MODIFY THEM, thanks!
        await browser.close();

        return parse(transactions);
    }(username, password);
}

var parse = function(raw){
    
    const actualTransactions = [];

    const day = "";
    const month = "";
    const year = "";    
    const category = "";
    const subcategory = "";
    const amount = "";
    const note = "";

    // It is in this loop that we pull out each individual elements
    // from the HTML (using RegExp).
    for (let i = 0; i < raw.length; i++){
        
        // We save each transaction in the 'actualTransactions' array,
        // and return it.
    }

    return actualTransactions;
}