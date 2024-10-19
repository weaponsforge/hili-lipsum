## hili-lipsum

Hilichurlian language lorem ipsum generator and web scraper using data from the Genshin Impact Fandom Wiki at https://genshin-impact.fandom.com/wiki/Hilichurlian/Lexicon.


### Data Structure

The `"npm run scrape"` web scraper script extracts Hilichurlian language data from https://genshin-impact.fandom.com/wiki/Hilichurlian/Lexicon into an array of JSON Objects under the `"data"` key.

It has the following format and structure:

| Key | Type | Description |
| --- | --- | --- |
| `word` | string | Hilichurlian (singular or plural) word |
| `eng` | string | English translation of the Hilichurlian word |
| `cn` | string | Chinese player analysis translation of the Hilichurlian word |
| `notes` | string | Notes and additional information about the Hilichurlian word |

### Example

```json
{
  "metadata": {
    "source": "https://genshin-impact.fandom.com/wiki/Hilichurlian/Lexicon",
    "title": "Hilichurlian Language Dictionary",
    "description": "Dictionary of Hilichurlian words and their English translations exctracted from the source URL.",
    "date_created": "2024-10-19T08:11:48.917Z"
  },
  "data": [
    {
      "word": "da",
      "eng": "good/very good, affirmation, very (emphasis)",
      "cn": "",
      "notes": "Can be used as praise"
    },
    ...
  ]
}
```

Checkout the full web-scraped data in the `/data/hilichurlianDB.json` file for more information.

## Requirements

The following requirements were used for this project. Feel free to use other dependencies and versions as needed.


1. Windows 10 OS
2. NodeJS v20.15.0

## Content

- [hili-lipsum](#hili-lipsum)
- [Data Structure](#data-structure)
- [Requirements](#requirements)
- [Content](#content)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
  - [`npm run scrape`](#npm-run-scrape)
  - [`npm run hipsum`](#npm-run-hipsum)
  - [`npm run lint`](#npm-run-lint)
  - [`npm run lint:fix`](#npm-run-lintfix)
- [Usage with Docker](#usage-with-docker)
   - [Preparing the Local Image](#preparing-the-local-image)
   - [Using the Docker Image](#using-the-docker-image)
- [Class Usage](#class-usage)
  - [`Hilichurl` Class](#hilichurl-class)
  - [`Hilipsum` Class](#hilipsum-class)
- [Deployment with GitHub Actions](#deployment-with-gitHub-actions)

## Installation

1. Clone this repository.<br>
`git clone https://github.com/weaponsforge/hili-lipsum.git`

2. Install dependencies.<br>
`npm install`

3. Create a `.env` file from the `.env.example` file. Use the default value for `HILICHURLIAN_TEXT_URL`.

   | Variable Name | Description |
   | --- | --- |
   | HILICHURLIAN_TEXT_URL | Target web page to scrape, containing Hilichurilian words definition.<br>Default value is: https://genshin-impact.fandom.com/wiki/Hilichurlian/Lexicon <br><br> You can reference other Hilichurlian words wiki or web page to scrape, but be be sure to make the necessary adjustments on the web scraping logic on `/src/classes/hilichurl/hilichurl.js` - **scrapewords()** method. |


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

### `npm run scrape:debug`

Sets the `IS_DOCKER=true` environment variable before running the `npm run scrape` script to enable debugging with VSCode inside a container.

> This command runs only in a Linux environment.

## Usage with Docker

### Preparing the Local Image

Obtain the development Docker image using any of the two (2) options. Navigate to the repository's root directory using a terminal, then run:

- **Pull the Pre-Built Docker Image**<br>
`docker compose -f docker-compose.dev.yml pull`

- **Build the Local Image**<br>
`docker compose -f docker-compose.dev.yml build`

### Using the Docker Image

1. Run the development container.<br>
`docker compose -f docker-compose.dev.yml up`

2. Run the [Available Scripts](#available-scripts) using the container. For example:<br>
`docker run exec -it weaponsforge-hili-lipsum npm run scrape`

## Class Usage

### `Hilichurl` Class

The `Hilichurl` Class allows to specify a local JSON file to use as a word dictionary. The JSON file should follow the format in `/data/hilichurlianDB.json`

```javascript
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

```javascript
const { Hilipsum } = require('./src/lib/classes/hilipsum')

// Use the the following if installed via npm
// const { Hilipsum } = require('hili-lipsum')

const hiLipsum = new Hilipsum()

// Generate a random hilichurlian sentence
console.log(hiLipsum.lipsum())
```

## Deployment with GitHub Actions

This repository deploys the **local development** Docker image to Docker Hub. It publishes the latest tag version to the NPM registry on the creation of new Release/Tags from the `master` branch.

Add the following GitHub Secrets and Variables to enable deployment to Docker Hub and the NPM registry.

**Docker Hub**<br>
https://hub.docker.com/r/weaponsforge/hili-lipsum

**NPM Registry**<br>
https://www.npmjs.com/package/hili-lipsum

#### GitHub Secrets

| GitHub Secret | Description |
| --- | --- |
| DOCKERHUB_USERNAME | (Optional) Docker Hub username. Required to enable pushing the development image to Docker Hub. |
| DOCKERHUB_TOKEN | (Optional) Deploy token for the Docker Hub account. Required to enable pushing the development image to Docker Hub. |
| NPM_TOKEN | NPM registry deployment token. |

#### GitHub Variables

| GitHub Variable | Description |
| --- | --- |
| DOCKERHUB_USERNAME | (Optional) Docker Hub username. Required to enable pushing the development image to Docker Hub. |

<br>

@weaponsforge<br>
20220805<br>
20241018
