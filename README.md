## hili-lipsum

Non-sensical hilichurlian sentence generator.

## Requirements

The following requirements were used for this project. Feel free to use other dependencies and versions as needed.


1. Windows 10 OS
2. NodeJS v16.14.2

## Installation

1. Clone this repository.<br>
`git clone https://github.com/weaponsforge/hili-lipsum.git`

2. Install dependencies.<br>
`npm install`

3. Create a `.env` file from the `.env.example` file. Use the default value for `HILICHURLIAN_TEXT_URL`.

   | Variable Name         | Description                                                                                                                                                                                                                                                                                           |
   | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | HILICHURLIAN_TEXT_URL | Target web page to scrape, containing Hilichurilian words definition. <br><br> You can reference other Hilichurlian words wiki or web page to scrape, but be be sure to make the necessary adjustments on the web scraping logic on `/src/classes/hilichurl/hilichurl.js` - **scrapewords()** method. |


## Available Scripts

### `npm run scrape`

Download, scrape and format hilichurlian words from the `HILICHURLIAN_TEXT_URL` .env variable.
Writes the extracted and formatted words into `/hilichurlianDB.json`

### `npm run hipsum`

Generates a random non-sensical Hilichurlian sentence (max 15 words).

### `npm run lint`

Lint JavaScript source codes.

### `npm run lint:fix`

Fix JavaScript lint errors.

@weaponsforge<br>
20220805
