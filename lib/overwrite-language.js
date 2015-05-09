var debug = require('debug')('overwrite-language');
var parseToArray = require('parse-accept-language').toArray;

// use cookies and query params to overwrite language selection

var MAX_AGE = 7 * 24 * 60 * 60 * 1000; // one week

function reducer(array) {
  return array.reduce(function(obj, item) {
    obj[item] = true;
    return obj;
  }, Object.create(null));
}

module.exports = function(opts) {
  var supported = reducer(opts.supportedLanguages);
  supported[opts.defaultLanguage] = true;

  return function overwrite(req, res, next) {
    var hl;

    if (req.lang) {
      debug('skip - language already detected:', req.lang);
      return next();
    }

    if (req.query.hasOwnProperty('hl')) {
      hl = req.query.hl;
      debug('detected query param', hl);
      if (!hl) {
        debug('clear language selection cookie');
        res.clearCookie('hl');
      }
    } else if (req.cookies.hl) {
      hl = req.cookies.hl;
      debug('detected cookie', hl);
    }

    if (hl && supported[hl]) {
      debug('overwriting req.lang', hl);
      req.lang = hl;
      req.parsedLang = parseToArray(hl)[0];
      // q > 1 means we overrode Accept-Language selection
      req.parsedLang.q = 100;
      res.cookie('hl', hl, {
        maxAge: MAX_AGE
      });
    }

    next();
  };
};
