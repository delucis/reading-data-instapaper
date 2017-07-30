# @delucis/reading-data-instapaper

[![Build Status](https://travis-ci.org/delucis/reading-data-instapaper.svg?branch=master)](https://travis-ci.org/delucis/reading-data-instapaper)

A plugin for [`@delucis/reading-data`](https://github.com/delucis/reading-data)
that fetches bookmarks from the [Instapaper API](https://www.instapaper.com/api).


## Installation

```sh
npm install --save @delucis/reading-data-instapaper
```


## Usage

To use this module, you will need to
[request tokens to use Instapaper’s API](https://www.instapaper.com/main/request_oauth_consumer_token)
and have log-in details for an Instapaper user.

```js
const RD = require('@delucis/reading-data')
const RD_INSTAPAPER = require('@delucis/reading-data-instapaper')

RD.use(RD_INSTAPAPER, {
  scope: 'instapaper',
  apiKey: '????????????????????????',
  apiSecret: '????????????????????????',
  userKey: 'instapaper.user@gmail.com',
  userSecret: 'goldfish123'
})

RD.run().then((res) => {
  console.log(res.data.instapaper)
})
```


## Options

`reading-data-instapaper` can be used with various options, some of which are
required for it to work.

name         | type      | default        | required? | description
-------------|-----------|----------------|:---------:|------------------------------------------------------------------------
`apiKey`     | `String`  |                | ✔︎         | an Instapaper API consumer key
`apiSecret`  | `String`  |                | ✔︎         | an Instapaper API consumer secret
`apiVersion` | `Number`  | `1.1`          |           | the version of the Instapaper API to use (`1` or `1.1`)
`fetchText`  | `Boolean` | `false`        |           | should the `fetch()` method try to retrieve the full text of bookmarks
`folder_id`  | `String`  | `'archive'`    |           | the Instapaper folder to request bookmarks from
`limit`      | `Number`  | `5`            |           | the maximum number of bookmarks requested from Instapaper (max: `500`)
`scope`      | `String`  | `'instapaper'` |           | the scope under which `reading-data` will store this plugin’s data
`userKey`    | `String`  |                | ✔︎         | an Instapaper user’s e-mail address
`userSecret` | `String`  |                | ✔︎         | an Instapaper user’s password
