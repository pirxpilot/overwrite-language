import test, { beforeEach } from 'node:test';
import overwriteLanguage from '../lib/overwrite-language.js';

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
    _cookie: {}
  };
});

test('does not change req.lang if present', function (t, done) {
  const req = {
    hostname: 'www.example.fr',
    lang: 'be'
  };

  this.ol(req, {}, err => {
    t.assert.equal(req.lang, 'be');
    done(err);
  });
});

test('detects language from hostname', function (t, done) {
  const req = {
    hostname: 'www.example.fr'
  };

  this.ol(req, {}, err => {
    t.assert.equal(req.lang, 'fr');
    done(err);
  });
});

test('detects language from subdomain', function (t, done) {
  const req = {
    hostname: 'fr.example.com'
  };

  this.ol(req, {}, err => {
    t.assert.equal(req.lang, 'fr');
    done(err);
  });
});

test('ignores unsuported subdomains', function (t, done) {
  const req = {
    hostname: 'no.example.com',
    cookies: {},
    query: {}
  };

  this.ol(req, {}, err => {
    t.assert.ok(!req.lang);
    done(err);
  });
});

test('detects language from query parameter', function (t, done) {
  const req = {
    hostname: 'www.example.com',
    query: { hl: 'pl' }
  };
  const cookie = this.res._cookie;

  this.ol(req, this.res, err => {
    t.assert.equal(req.lang, 'pl');
    t.assert.equal(cookie.hl, 'pl');
    done(err);
  });
});

test('detects language from cookie', function (t, done) {
  const req = {
    hostname: 'www.example.com',
    query: {},
    cookies: {
      hl: 'de'
    }
  };

  this.ol(req, this.res, err => {
    t.assert.equal(req.lang, 'de');
    done(err);
  });
});
