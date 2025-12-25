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

test('clears cookie when hl query parameter is empty', function (t, done) {
  const req = {
    hostname: 'www.example.com',
    query: { hl: '' },
    path: '/test',
    cookies: {}
  };
  let cookieCleared = false;
  const res = {
    clearCookie(name) {
      t.assert.equal(name, 'hl');
      cookieCleared = true;
    }
  };

  this.ol(req, res, err => {
    t.assert.ok(cookieCleared, 'clearCookie should be called');
    t.assert.ok(!req.lang);
    done(err);
  });
});

test('ignores unsupported language from query parameter', function (t, done) {
  const req = {
    hostname: 'www.example.com',
    query: { hl: 'unsupported' },
    path: '/test',
    secure: false
  };
  const cookie = this.res._cookie;

  this.ol(req, this.res, err => {
    t.assert.ok(!req.lang, 'req.lang should not be set for unsupported language');
    t.assert.equal(cookie.hl, 'unsupported', 'cookie should still be set');
    done(err);
  });
});

test('ignores unsupported language from cookie', function (t, done) {
  const req = {
    hostname: 'www.example.com',
    query: {},
    cookies: {
      hl: 'unsupported'
    }
  };

  this.ol(req, this.res, err => {
    t.assert.ok(!req.lang, 'req.lang should not be set for unsupported language');
    done(err);
  });
});

test('sets cookie with secure and sameSite=none when request is secure', function (t, done) {
  const req = {
    hostname: 'www.example.com',
    query: { hl: 'pl' },
    path: '/test',
    secure: true
  };
  let cookieOptions;
  const res = {
    cookie(name, value, options) {
      t.assert.equal(name, 'hl');
      t.assert.equal(value, 'pl');
      cookieOptions = options;
    }
  };

  this.ol(req, res, err => {
    t.assert.equal(req.lang, 'pl');
    t.assert.ok(cookieOptions, 'cookie options should be set');
    t.assert.equal(cookieOptions.secure, true);
    t.assert.equal(cookieOptions.sameSite, 'none');
    done(err);
  });
});
