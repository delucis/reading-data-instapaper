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

  IT('should have a fetch method', function () {
    EXPECT(RDInstapaper).to.have.property('fetch')
    EXPECT(RDInstapaper.fetch).to.be.a('function')
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
})
