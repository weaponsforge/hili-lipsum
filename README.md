## hili-lipsum

Non-sensical hilichurlian sentence generator.

## Requirements

The following requirements were used for this project. Feel free to use other dependencies and versions as needed.


1. Windows 10 OS
2. NodeJS v16.14.2

## Content

- [hili-lipsum](#hili-lipsum)
- [Requirements](#requirements)
- [Content](#content)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
  - [`npm run scrape`](#npm-run-scrape)
  - [`npm run hipsum`](#npm-run-hipsum)
  - [`npm run lint`](#npm-run-lint)
  - [`npm run lint:fix`](#npm-run-lintfix)
- [Class Usage](#class-usage)
  - [`Hilichurl` Class](#hilichurl-class)
  - [`Hilipsum` Class](#hilipsum-class)

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

## Class Usage

### `Hilichurl` Class

The `Hilichurl` Class allows to specify a local JSON file to use as a word dictionary. The JSON file should follow the format in `/data/hilichurlianDB.json`

```
const { Hilichurl } = require('./src/lib/classes/hilichurl')
const path = require('path')

// Use the the following if installed via npm
// const { Hhilichurl } = require('hili-lipsum')

const main = async () => {
  try {
    // Instantiate a new Hilichurl class with local JSON data
    const dataPath = path.join(__dirname, 'data', 'hilichurlianDB.json')
    const hilichurl = new Hilichurl(dataPath)

    // Load new local JSON data
    hilichurl.loadrecords(dataPath)

    // Generate a random-word sentence
    const sentence = hilichurl.lipsum(40)
    console.log(sentence)

    // Download and replace the current word dictionary
    await hilichurl.fetchrecords()

    // Write the word dictionary to a JSON file
    hilichurl.writerecords()
  } catch (err) {
    console.log(err.message)
  }
}

main()
```

### `Hilipsum` Class

The `Hilipsum` class is a sub-class of `Hilichurl`. It automatically loads the local JSON word dictionary (`/data/hilichurlianDB.json`) on initialization.

```
const { Hilipsum } = require('./src/lib/classes/hilipsum')

// Example usage of the Hilipsum class
const hiLipsum = new Hilipsum()

// Generate a random hilichurlian sentence
console.log(hiLipsum.lipsum())
```

@weaponsforge<br>
20220805
