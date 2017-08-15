'use strict'

const DESCRIBE = require('mocha').describe
const BEFORE_EACH = require('mocha').beforeEach
const IT = require('mocha').it
const EXPECT = require('chai').expect
const READING_DATA = require('@delucis/reading-data')
const RDInstapaper = require('../index')
const CREDENTIALS = {
  apiKey: process.env.INSTAPAPER_API_KEY,
  apiSecret: process.env.INSTAPAPER_API_SECRET,
  userKey: process.env.INSTAPAPER_USER_KEY,
  userSecret: process.env.INSTAPAPER_USER_SECRET
}

BEFORE_EACH(function () {
  READING_DATA.uninstall()
})

DESCRIBE('ReadingDataInstapaper', function () {
  IT('should be an object', function () {
    EXPECT(RDInstapaper).to.be.an('object')
  })

  IT('should have a data method', function () {
    EXPECT(RDInstapaper).to.have.property('data')
    EXPECT(RDInstapaper.data).to.be.a('function')
  })

  IT('should throw an error if used without API tokens', async function () {
    READING_DATA.use(RDInstapaper)
    try {
      await READING_DATA.run()
    } catch (e) {
      EXPECT(e).to.be.an('error')
    }
  })

  IT('should throw an error if used without user credentials', async function () {
    READING_DATA.use(RDInstapaper, {
      apiKey: 'bogus-key',
      apiSecret: 'bogus-secret'
    })
    try {
      await READING_DATA.run()
    } catch (e) {
      EXPECT(e).to.be.an('error')
    }
  })

  IT('should fetch some data during ReadingData#run()', async function () {
    this.timeout(20000)
    let testScope = 'instaTest'
    let config = Object.assign(CREDENTIALS, {
      scope: testScope
    })
    READING_DATA.use(RDInstapaper, config)
    await READING_DATA.run()
    EXPECT(READING_DATA.data).to.have.property(testScope)
    EXPECT(READING_DATA.data[testScope]).to.have.property('bookmarks')
    EXPECT(READING_DATA.data[testScope].bookmarks).to.be.an('array')
  })

  IT('should fetch a bookmark’s text if config.fetchText is true', async function () {
    this.timeout(20000)
    let testScope = 'textFetcherTest'
    let config = Object.assign(CREDENTIALS, {
      scope: testScope,
      limit: 1,
      fetchText: true
    })
    READING_DATA.use(RDInstapaper, config)
    await READING_DATA.run()
    EXPECT(READING_DATA.data).to.have.property(testScope)
    EXPECT(READING_DATA.data[testScope]).to.have.property('bookmarks')
    EXPECT(READING_DATA.data[testScope].bookmarks).to.be.an('array')
    EXPECT(READING_DATA.data[testScope].bookmarks[0]).to.have.property('text')
  })

  IT('should preserve preloaded data when useCache is true', async function () {
    this.timeout(20000)
    let testScope = 'haveParameterTest'
    let config = Object.assign(CREDENTIALS, {
      scope: testScope,
      limit: 1,
      fetchText: false,
      useCache: true
    })
    let bogusBookmark = {
      bookmark_id: 1,
      text: 'I’m a bogus preloaded bookmark'
    }
    READING_DATA.use(RDInstapaper, config)
    READING_DATA.preloadData({
      [testScope]: {
        bookmarks: [ bogusBookmark ]
      },
      user: { type: 'user' }
    })
    await READING_DATA.run()
    EXPECT(READING_DATA.data[testScope].bookmarks).to.have.lengthOf(2)
    EXPECT(READING_DATA.data[testScope].bookmarks).to.include(bogusBookmark)
  })

  IT('should preserve previous fetch data when useCache is true', async function () {
    this.timeout(20000)
    let testScope = 'cacheTest'
    let config = Object.assign(CREDENTIALS, {
      scope: testScope,
      limit: 1,
      fetchText: false,
      useCache: true
    })
    READING_DATA.use(RDInstapaper, config)
    await READING_DATA.run()
    EXPECT(READING_DATA.data).to.have.property(testScope)
    EXPECT(READING_DATA.data[testScope]).to.have.property('bookmarks')
    let firstRunData = READING_DATA.data[testScope].bookmarks
    await READING_DATA.run()
    EXPECT(READING_DATA.data).to.have.property(testScope)
    EXPECT(READING_DATA.data[testScope]).to.have.property('bookmarks')
    for (let bookmark of firstRunData) {
      EXPECT(READING_DATA.data[testScope].bookmarks).to.include(bookmark)
    }
  })
})
