const axios = require("axios");
const cheerio = require("cheerio");
const scrapper = require("./scrapper");
// My initial plan is to extract data only from this site "https://entzhood.com.ng"

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

//This is limit of invalid attempt
let counter = 3;

function requestUrl() {
    rl.question("Enter the website url: ", async (websiteUrl) => {
        const webScrapper = new scrapper(websiteUrl);
        const [valid, value] = await webScrapper.scrap();
        if (valid) {
            //Use the value
            console.log(value)
            rl.close();
        } else {
            if (counter > 1) {
                counter--;
                console.log(`\nError!\n${value}`);
                console.log(`\nYou have ${counter} web url attempt remaining`);
                requestUrl();
            } else {
                rl.close();
            }
        }
    });
}

requestUrl();
