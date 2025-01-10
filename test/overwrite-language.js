const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const overwriteLanguage = require('../');

describe('overwrite-language node module', function () {

  beforeEach(function () {
    const locale = {
      supportedLanguages: ['de', 'fr', 'pl', 'en-GB', 'en-US'],
      defaultLanguage: 'en'
    };
    this.ol = overwriteLanguage(locale);
    this.res = {
      cookie(name, value) {
        this._cookie[name] = value;
      },
      clearCookie() {
        delete this._cookie;
      },
      _cookie: {},
    };
  });

  it('does not change req.lang if present', function (_, done) {
    const req = {
      hostname: 'www.example.fr',
      lang: 'be'
    };

    this.ol(req, {}, function (err) {
      assert.equal(req.lang, 'be');
      done(err);
    });
  });

  it('detects language from hostname', function (_, done) {
    const req = {
      hostname: 'www.example.fr'
    };

    this.ol(req, {}, function (err) {
      assert.equal(req.lang, 'fr');
      done(err);
    });
  });

  it('detects language from subdomain', function (_, done) {
    const req = {
      hostname: 'fr.example.com'
    };

    this.ol(req, {}, function (err) {
      assert.equal(req.lang, 'fr');
      done(err);
    });
  });

  it('ignores unsuported subdomains', function (_, done) {
    const req = {
      hostname: 'no.example.com',
      cookies: {},
      query: {}
    };

    this.ol(req, {}, function (err) {
      assert.ok(!req.lang);
      done(err);
    });
  });

  it('detects language from query parameter', function (_, done) {
    const req = {
      hostname: 'www.example.com',
      query: { hl: 'pl' }
    };
    const cookie = this.res._cookie;

    this.ol(req, this.res, function (err) {
      assert.equal(req.lang, 'pl');
      assert.equal(cookie.hl, 'pl');
      done(err);
    });
  });

  it('detects language from cookie', function (_, done) {
    const req = {
      hostname: 'www.example.com',
      query: {},
      cookies: {
        hl: 'de'
      }
    };

    this.ol(req, this.res, function (err) {
      assert.equal(req.lang, 'de');
      done(err);
    });
  });

});
