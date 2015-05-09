var overwriteLanguage = require('../');

describe('overwrite-language node module', function () {
  it('does not change req.lang if present', function (done) {
    var locale = {
      supportedLanguages: ['de', 'fr', 'pl', 'en-GB', 'en-US'],
      defaultLanguage: 'en'
    };
    var ol = overwriteLanguage(locale);
    var req = {
      lang: 'be'
    };

    ol(req, {}, function(err) {
      req.should.have.property('lang', 'be');
      done(err);
    });
  });
});
