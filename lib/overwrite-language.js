const debug = require('debug')('overwrite-language');
const parseToArray = require('parse-accept-language').toArray;

// use cookies and query params to overwrite language selection

const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // one week

function reducer(array) {
  return array.reduce(function(obj, item) {
    obj[item] = true;
    return obj;
  }, Object.create(null));
}

function getTld(host) {
  return host.slice(host.lastIndexOf('.') + 1);
}

module.exports = function(opts) {
  const supported = reducer(opts.supportedLanguages);
  supported[opts.defaultLanguage] = true;

  return function overwrite(req, res, next) {
    let hl;
    let tld;

    if (req.lang) {
      debug('skip - language already detected:', req.lang);
      return next();
    }

    tld = getTld(req.hostname);
    if (supported[tld]) {
      hl = tld;
      debug('detected known TLD', hl);
    } else if (req.query.hasOwnProperty('hl')) {
      hl = req.query.hl;
      debug('detected query param %s on %s', hl, req.path);
      if (!hl) {
        debug('clear language selection cookie');
        res.clearCookie('hl');
      } else {
        res.cookie('hl', hl, {
          maxAge: MAX_AGE
        });
      }
    } else if (req.cookies.hl) {
      hl = req.cookies.hl;
      debug('detected cookie %s on %s', hl, req.path);
    }

    if (hl && supported[hl]) {
      debug('overwriting req.lang', hl);
      req.lang = hl;
      req.parsedLang = parseToArray(hl)[0];
      // q > 1 means we overrode Accept-Language selection
      req.parsedLang.q = 100;
    }

    next();
  };
};
