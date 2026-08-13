## hili-lipsum

A Hilichurlian lorem ipsum generator and dictionary data fetcher for the
[Genshin Impact Fandom Wiki](https://genshin-impact.fandom.com/wiki/Hilichurlian/Lexicon)'s
Hilichurlian language.

Generate random Hilichurlian sentences from a locally stored dictionary,
or fetch the currently available Hilichurlian vocabulary from the [Genshin Impact Fandom MediaWiki Action API](https://genshin-impact.fandom.com/api.php).

### 🎯 Features

- Generate random Hilichurlian lorem ipsum text
- Generate Hilichurlian sentences with a configurable word count
- Fetch Hilichurlian vocabulary from the [Genshin Impact Fandom MediaWiki API](https://genshin-impact.fandom.com/wiki/Hilichurlian/Lexicon)
- Scrape Hilichurlian vocabulary from web pages similar to https://genshin-impact.fandom.com/wiki/Hilichurlian/Lexicon if allowed
- Save scraped vocabulary as JSON
- Use a local JSON dictionary without network access
- Use the library programmatically through `Hilichurl` and `Hilipsum`
- Run through Node.js, npm, or Docker

### 🆕 Quick Start

**CLI Available**

> [!TIP]
> - **Run via npx (no installation required)**
>   - Requirements: NodeJS LTS v24 or later
>   - Run `npx hili-lipsum --help`<br><br>
> - **Docker image**
>   - A Docker image is available at https://hub.docker.com/r/weaponsforge/hili-lipsum

### Content

- [Content](#content)
- [Quick Start](#-quick-start)
- [Data Source](#-data-source)
- [Data Structure](#-data-structure)
- [Contributing](#-contributing)
- [Requirements](#-requirements)
- [Installation](#️-installation)
- [Available Scripts](#-available-scripts)
- [Class Usage](#️-class-usage)
- [TypeScript](#-typescript)
- [Usage with Docker](#-usage-with-docker)
- [Deployment with GitHub Actions](#-deployment-with-github-actions)
- [Disclaimer](#-disclaimer)

## 📊 Data Source

By default, `npm run scrape` retrieves the Hilichurlian Lexicon through
the [Genshin Impact Fandom MediaWiki Action API](https://genshin-impact.fandom.com/api.php).

The source is configured using:

- `MEDIAWIKI_API_ROOT` — MediaWiki API endpoint
- `MEDIAWIKI_PAGE` — page name to retrieve

If the configured `MEDIAWIKI_API_ROOT` is not a MediaWiki API-compatible endpoint,
the scraper can also process HTML pages with a structure similar to the
[Hilichurlian Lexicon](https://genshin-impact.fandom.com/wiki/Hilichurlian/Lexicon).

## 🧩 Data Structure

Hilichurlian data has the following format and structure:

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
    "source": "https://genshin-impact.fandom.com/api.php?action=parse&format=json&formatversion=2&prop=text&page=Hilichurlian%2FLexicon",
    "title": "Hilichurlian Language Dictionary",
    "description": "Dictionary of Hilichurlian words and their English translations extracted from the source URL.",
    "date_created": "2026-08-13T12:20:02.351Z"
  },
  "data": [
    {
      "word": "da",
      "eng": "good/very good, affirmation, very (emphasis)",
      "cn": null,
      "notes": "Can be used as praise"
    },
    ...
  ]
}
```

Checkout the full web-scraped data in the `/data/hilichurlianDB.json` file for more information.

<br>

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

<br>

## 📋 Requirements

The project is developed and tested with:

- Node.js 24.11.0
- npm 11.6.1

<br>

## 🛠️ Installation

1. Clone this repository.<br>
`git clone https://github.com/weaponsforge/hili-lipsum.git`

2. Install dependencies.<br>
`npm install`

3. Create a `.env` file from the `.env.example` file. Use the default value for `MEDIAWIKI_API_ROOT`.

   | Variable Name | Description |
   | --- | --- |
   | MEDIAWIKI_PAGE | Genshin Impact Fandom MediaWiki page name of the Hilichurlian word dictionary at https://genshin-impact.fandom.com/wiki/Hilichurlian/Lexicon. Default value is `Hilichurlian/Lexicon`. |
   | MEDIAWIKI_API_ROOT | Genshin Impact Fandom MediaWiki API root URL. It allows fetching wiki page data programmatically for non-web browsers.<br>Default value is: https://genshin-impact.fandom.com/api.php. <br><br> You can reference other Hilichurlian words wiki or web page to scrape using `MEDIAWIKI_PAGE`, but be sure to make the necessary adjustments on the web scraping logic on `/src/lib/classes/hilichurl/hilichurl.js` - **scrapewords()** and **formatwords()** methods. |

<br>

## 📜 Available Scripts

### `npm start`

Runs the CLI. Shorthand for `node ./src/cli/main.js`

**Usage**

```sh
npm start                   # shows help options
npm start scrape            # CLI command for "npm run scrape"
npm start hipsum            # CLI command for "npm run hipsum"
npm start -- hipsum -w 25   # CLI for "npm run hipsum" with -w (wordcount) parameter
```

### `npm run scrape`

Download, scrape and format hilichurlian words from the `MEDIAWIKI_API_ROOT` .env variable.
Writes the extracted and formatted words into a `/hilichurlianDB-<TIMESTAMP>.json` file.

### `npm run hipsum`

- Generates a random ipsum-like Hilichurlian sentence consisting of 15 words by default.
- Generates a random Hilichurlian sentence consisting of `N` words if provided with the `--wordcount` flag:<br>

   ```
   npm run hipsum -- --wordcount=100
   ```

### `npm run lint`

Lint JavaScript source codes.

### `npm run lint:fix`

Fix JavaScript lint errors.

### `npm run scrape:debug`

Sets the `IS_DOCKER_DEBUG=true` environment variable before running the `npm run scrape` script to enable debugging with VSCode inside a container.

> This command runs only in a Linux environment.

### `npm run start:debug`

Sets the `IS_DOCKER_DEBUG=true` environment variable before running the **CLI entry point** script to enable debugging with VSCode inside a container.

> This command runs only in a Linux environment.

### `npm run create:declaration`

Generates TypeScript declaration `.d.ts` files from the CommonJS JavaScript classes and scripts.

### `npm test`

Run tests defined in the `__tests__` directory.

## 🏗️ Class Usage

| Class| Purpose |
| --- | --- |
| `Hilichurl` | Base class for loading, fetching, writing and generating from a dictionary |
| `Hilipsum` | Convenience subclass that automatically loads the bundled dictionary |


### `Hilichurl` Class

The `Hilichurl` Class allows to specify a local JSON file to use as a word dictionary. The JSON file should follow the format in `/data/hilichurlianDB.json`

```javascript
const { Hilichurl } = require('./src/lib/classes/hilichurl')
const path = require('path')

// Use the the following if installed via npm
// const { Hilichurl } = require('hili-lipsum')

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

## 🔷 TypeScript

`hili-lipsum` ships with bundled type declarations — no `@types` package needed.

```typescript
import { Hilichurl, Hilipsum } from 'hili-lipsum'

const hiLipsum = new Hilipsum()
const sentence: string = hiLipsum.lipsum(40)
```

Type declarations are generated from JSDoc annotations in the source and are kept
in sync automatically via the `create:declaration` script (see [Available Scripts](#available-scripts)).

<br>

## 🐳 Usage with Docker

The project includes a Docker Compose configuration for development. Before starting the container, create a `.env` file from `.env.example` as instructed in the [Installation](#installation) section.

### Preparing the Local Image

Obtain the development Docker image using any of the two (2) options. Navigate to the repository's root directory using a terminal, then run:

- **Pull the Pre-Built Docker Image**<br>
`docker compose pull`

- **Build the Local Image**<br>
`docker compose build`

### Using the Docker Image

1. Run the development container.<br>
`docker compose up`

2. Run the [Available Scripts](#-available-scripts) using the container. For example:<br>
`docker exec weaponsforge-hili-lipsum npm run scrape`

<br>

## 🚀 Deployment with GitHub Actions

This repository publishes the **development** Docker image to Docker Hub. New npm versions are published when a Release/Tag is created from `master`.

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

#### GitHub Variables

| GitHub Variable | Description |
| --- | --- |
| DOCKERHUB_USERNAME | (Optional) Docker Hub username. Required to enable pushing the development image to Docker Hub. |

<br>

## 🔔 Disclaimer

> [!NOTE]
> `hili-lipsum` is an independent, fan-made project and is not<br>
> affiliated with or endorsed by HoYoverse or the Genshin Impact Wiki.<br>
> Hilichurlian vocabulary is sourced from the referenced public wiki/API.<br>

<br>

## 🔍 References

**Genshin Impact Fandom Wiki**

- Hilichurlian Lexicon Wiki <sup>[[1]](https://genshin-impact.fandom.com/wiki/Hilichurlian/Lexicon)</sup>
- MediaWiki API Docs <sup>[[2]](https://genshin-impact.fandom.com/api.php)</sup>
- MediaWiki API - Action API <sup>[[3]](https://www.mediawiki.org/wiki/API:Action_API)</sup>
- MediaWiki API - Parsing wikitext <sup>[[4]](https://www.mediawiki.org/wiki/API:Parsing_wikitext)</sup>
- MediaWiki API Sandbox <sup>[[5]](https://genshin-impact.fandom.com/wiki/Special:ApiSandbox#action=parse)</sup>

<br>

@weaponsforge<br>
20220805
