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

### 🆕 CLI Available

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
- [Class Usage](#️-class-usage)
- [TypeScript](#-typescript)
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

We welcome contributions! Please see [CONTRIBUTING.md](https://github.com/weaponsforge/hili-lipsum/blob/dev/CONTRIBUTING.md) for guidelines.

<br>

## 📋 Requirements

The project is developed and tested with:

- Node.js 24.11.0
- npm 11.6.1

<br>

## 🛠️ Installation

1. Install the library.<br>
`npm install hili-lipsum`

2. Create a `.env` file from the `.env.example` file. Use the default value for `MEDIAWIKI_API_ROOT`.

   | Variable Name | Description |
   | --- | --- |
   | MEDIAWIKI_PAGE | Genshin Impact Fandom MediaWiki page name of the Hilichurlian word dictionary at https://genshin-impact.fandom.com/wiki/Hilichurlian/Lexicon. Default value is `Hilichurlian/Lexicon`. |
   | MEDIAWIKI_API_ROOT | Genshin Impact Fandom MediaWiki API root URL. It allows fetching wiki page data programmatically for non-web browsers.<br>Default value is: https://genshin-impact.fandom.com/api.php. <br><br> You can reference other Hilichurlian words wiki or web page to scrape using `MEDIAWIKI_PAGE`, but be sure to make the necessary adjustments on the web scraping logic on `/src/lib/classes/hilichurl/hilichurl.js` - **scrapewords()** and **formatwords()** methods. |

<br>

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

### Convenience Functions

The following codes demonstrates using the `hipsum()` and `scrape()` functions using internal-declared `Hilipsum` and `Hilichurl` classes.

```javascript
const { hipsum } = require("../src/scripts/hipsum/hipsum")
const { scrape } = require("../src/scripts/scrape/scrape")

// Use the the following if installed via npm
// const { hipsum, scrape } = require('hili-lipsum')

// Generate a 58-word random Hilichurlian sentence
hipsum(58)

// Fetch current available Hilichurlian data and
// write to a `/hilichurlianDB-<TIMESTAMP>.json` file
scrape()
```

<br>

## 🔷 TypeScript

`hili-lipsum` ships with bundled type declarations — no `@types` package needed.

```typescript
import { Hilichurl, Hilipsum } from 'hili-lipsum'

const hiLipsum = new Hilipsum()
const sentence: string = hiLipsum.lipsum(40)
```

Type declarations are generated from JSDoc annotations in the source and are kept
in sync automatically via the `create:declaration` script (see [Available Scripts](https://github.com/weaponsforge/hili-lipsum#npm-run-createdeclaration)).

<br>

## 🔔 Disclaimer

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
