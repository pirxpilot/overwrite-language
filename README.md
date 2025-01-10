[![NPM version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Dependency Status][deps-image]][deps-url]

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

MIT © [Damian Krzeminski](https://pirxpilot.me)

[detect-language]: https://npmjs.org/package/detect-language

[npm-image]: https://img.shields.io/npm/v/overwrite-language
[npm-url]: https://npmjs.org/package/overwrite-language

[build-url]: https://github.com/pirxpilot/overwrite-language/actions/workflows/check.yaml
[build-image]: https://img.shields.io/github/actions/workflow/status/pirxpilot/overwrite-language/check.yaml?branch=main

[deps-image]: https://img.shields.io/librariesio/release/npm/overwrite-language
[deps-url]: https://libraries.io/npm/overwrite-language

