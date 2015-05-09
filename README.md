[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][gemnasium-image]][gemnasium-url]

# overwrite-language

Overwrite request language using cookie or query parameter. Use with [detect-language].

## Install

```sh
$ npm install --save overwrite-language
```

## Usage

```js
var locale = {
  supportedLanguages: ['de', 'fr', 'pl', 'en-GB', 'en-US'],
  defaultLanguage: 'en'
};

app.use(require('overwrite-language')(locale));
```

Cookie and query parameter name is `hl`

To set language to German (and to set cookie):

    http://example.com?hl=de

Sending empty `hl` value removes the cookie:

    http://example.com?hl

Overwritten language is set in `req.lang`

## License

MIT © [code42day](https://code42day.com)

[detect-language]: https://npmjs.org/package/detect-language

[npm-image]: https://img.shields.io/npm/v/overwrite-language.svg
[npm-url]: https://npmjs.org/package/overwrite-language

[travis-url]: https://travis-ci.org/code42day/overwrite-language
[travis-image]: https://img.shields.io/travis/code42day/overwrite-language.svg

[gemnasium-image]: https://img.shields.io/gemnasium/code42day/overwrite-language.svg
[gemnasium-url]: https://gemnasium.com/code42day/overwrite-language
