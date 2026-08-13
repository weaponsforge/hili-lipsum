const API_ROOT = process.env.MEDIAWIKI_API_ROOT ??
  'https://genshin-impact.fandom.com/api.php'

const PAGE_NAME = process?.env?.MEDIAWIKI_PAGE_NAME ??
  'Hilichurlian/Lexicon'

module.exports = {
  API_ROOT,
  PAGE_NAME
}
