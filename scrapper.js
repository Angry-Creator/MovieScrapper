const axios = require("axios");
const cheerio = require("cheerio");

class Scrapper {
    constructor(websiteUrl) {
        this.websiteDomain = "https://entzhood.com.ng/";
        this.websiteUrl = websiteUrl;
    }

    checkUrl() {
        return (((Array.from(this.websiteUrl).splice(0, 24)).join("") == this.websiteDomain));
    }

    async getSiteData() {
        const sourceCode = await axios.get(this.websiteUrl).then((response) => {
            return [true, response.data];
        }).catch((error) => {
            return [false, error]
        });
        const [valid, value] = sourceCode;
        if (valid) {
            const $ = cheerio.load(value);
            const movie_image = $($(".post-page-featured-image").children()[0]).attr("data-src");
            const movie_title = $(" h1.post-title").text();

            let downloadLinks = {};
            $("p a").each((index, element) => {
                if (((Array.from($(element).text()).splice(0, 13)).join("")).toLowerCase() != "download more") {
                    if (((Array.from($(element).text()).splice(0, 8)).join("")).toLowerCase() == "download") {
                        downloadLinks[$(element).text()] = $(element).attr("href");
                    }
                }
            })

            //First Parent value - Download Now, Second Parent value - anchor tag, using the second parent html to be h3 anchor tag to get the sibling next(), finally get the text
            let movie_description = $($($("h3 a").parent()).parent()).next();
            if (movie_description[0].name == "blockquote") {
                movie_description = $($($("h3 a").parent()).parent()).prev();
            }
            movie_description = movie_description.text();

            //Organizing all data into an object
            const movie_data = {};
            movie_data["title"] = movie_title;
            movie_data["image"] = movie_image;
            movie_data["description"] = movie_description;
            movie_data["links"] = downloadLinks;

            return [true, movie_data]
        } else {
            return [false, "Error Occurred During Retrieving Source Code!"]
        }
    }

    async scrap() {
        //If the url matches/does not match the main domain then
        if (this.checkUrl()) {
            console.log("\nThe url matches the site's url...\n")
            return await this.getSiteData();
        }
        else {
            return [false, "Error Occurred Due to invalid Source Code!"]
        }
    }
}


module.exports = Scrapper;