/**
 * @module reading-data-instapaper
 */

const instapaper = require('instapaper')
const log = require('winston')

const ReadingDataInstapaper = (function () {
  /**
   * Return an array of bookmark IDs from an array of bookmarks.
   * @memberof module:reading-data-instapaper
   * @private
   * @param  {Array} bookmarks An array of Instapaper bookmarks.
   * @return {Array}           An array of Instapaper bookmark IDs.
   */
  let getBookmarkIDs = (bookmarks) => {
    let ids = []
    bookmarks.map((bookmark) => {
      ids.push(bookmark.bookmark_id)
    })
    return ids
  }

  return {
    /**
     * Configuration object providing a default configuration to be
     * used by ReadingData#use()
     * @type {Object}
     * @property {String} scope='instapaper'  - The scope this plugin’s data should be saved under on the ReadingData instance.
     * @property {Number} limit=5             - The maximum number of bookmarks to request from the Instapaper API.
     * @property {String} folder_id='archive' - The folder to request from the Instapaper API.
     * @property {Number} apiVersion=1.1      - The version of the Instapaper API that should be queried.
     * @property {Boolean} fetchText=false    - Whether or not to try to retrieve a bookmark’s full text.
     * @property {Boolean} useCache=false     - Whether or not to use cached/preloaded data.
     */
    config: {
      scope: 'instapaper',
      limit: 5,
      folder_id: 'archive',
      apiVersion: 1.1,
      fetchText: false,
      useCache: false
    },

    /**
     * Create a client for the Instapaper API and request a collection of bookmarks.
     * @param  {Object} pluginContext Context variables specific to this plugin.
     * @param  {Object} pluginContext.config This plugin’s configuration.
     * @param  {Object} pluginContext.data   Any data already stored by ReadingData under this plugin’s scope.
     * @param  {Object} context Contextual this passed from the ReadingData calling environment. Equivalent to the entire ReadingData instance.
     * @param  {Object} context.config Global configuration settings.
     * @param  {Object} context.data Data stored on the ReadingData instance.
     * @return {Object} Data to be stored by ReadingData under this plugin’s scope.
     */
    fetch: async function ({config, data}) {
      // Set the URL for the configured API version
      let apiUrl = 'https://www.instapaper.com/api/' + config.apiVersion
      // Throw out any attempt to use fetch() without configuring API keys & user credentials

      if (!config.hasOwnProperty('apiKey') || !config.hasOwnProperty('apiSecret')) {
        throw new Error('ReadingDataInstapaper#fetch(): config must contain `apiKey` and `apiSecret`')
      }
      if (!config.hasOwnProperty('userKey') || !config.hasOwnProperty('userSecret')) {
        throw new Error('ReadingDataInstapaper#fetch(): config must contain `userKey` and `userSecret`')
      }

      // Initialise Instapaper client with credentials
      let client = instapaper(config.apiKey, config.apiSecret, { apiUrl: apiUrl })
      client.setUserCredentials(config.userKey, config.userSecret)
      let d
      try {
        let res = await client.bookmarks.list({ limit: config.limit, folder_id: config.folder_id })
        d = JSON.parse(res)
      } catch (e) {
        log.error('ReadingDataInstapaper#fetch(): error parsing Instapaper API response.\n', e)
      }

      // Fetch full text from the Instapaper API
      if (config.fetchText && d.hasOwnProperty('bookmarks')) {
        await Promise.all(d.bookmarks.map(async bookmark => {
          try {
            log.debug('ReadingDataInstapaper#fetch(): fetching full text for bookmark', bookmark.bookmark_id)
            bookmark.text = await client.bookmarks.getText(bookmark.bookmark_id)
          } catch (e) {
            log.error('ReadingDataInstapaper#fetch(): error retrieving bookmark text for', bookmark.bookmark_id, '\n', e)
          }
        }))
      }
      return d
    }
  }
}())

module.exports = ReadingDataInstapaper
