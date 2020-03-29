const overwriteLanguage = require('../');

describe('overwrite-language node module', function () {

  beforeEach(function() {
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

  it('does not change req.lang if present', function (done) {
    const req = {
      hostname: 'www.example.fr',
      lang: 'be'
    };

    this.ol(req, {}, function(err) {
      req.should.have.property('lang', 'be');
      done(err);
    });
  });

  it('detects language from hostname', function (done) {
    const req = {
      hostname: 'www.example.fr'
    };

    this.ol(req, {}, function(err) {
      req.should.have.property('lang', 'fr');
      done(err);
    });
  });

  it('detects language from query parameter', function (done) {
    const req = {
      hostname: 'www.example.com',
      query: { hl: 'pl' }
    };
    const cookie = this.res._cookie;

    this.ol(req, this.res, function(err) {
      req.should.have.property('lang', 'pl');
      cookie.should.have.property('hl', 'pl');
      done(err);
    });
  });

  it('detects language from cookie', function (done) {
    const req = {
      hostname: 'www.example.com',
      query: {},
      cookies: {
        hl: 'de'
      }
    };

    this.ol(req, this.res, function(err) {
      req.should.have.property('lang', 'de');
      done(err);
    });
  });

});
