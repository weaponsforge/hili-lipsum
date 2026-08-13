// CLI metadata
const CLI_META = {
  PROGRAM: {
    NAME: 'hili-lipsum',
    DESCRIPTION: 'A Hilichurlian lorem ipsum generator and dictionary data fetcher for the Genshin Impact Fandom Wiki\'s Hilichurlian Lexicon'
  },
  CMD_SCRAPE: {
    NAME: 'scrape',
    DESCRIPTION: 'Fetches the current available Hilichurlian words data from `MEDIAWIKI_PAGE_NAME` and writes it to a "hilichurlDB-<timestamp>.json" file relative to where this script is run'
  },
  CMD_HIPSUM: {
    NAME: 'hipsum',
    DESCRIPTION: 'Generates a Hilichurlian sentence made up of random Hilichurlian words.'
  }
}

const CLI_ARGS = {
  CMD_HIPSUM: {
    WORDCOUNT: {
      OPTION: '-w --wordcount [count]',
      DESCRIPTION: 'Number of Hilichurlian words'
    }
  }
}

module.exports = {
  CLI_META,
  CLI_ARGS
}
