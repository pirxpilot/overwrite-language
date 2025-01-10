const debug = require('debug')('overwrite-language');
const parseToArray = require('parse-accept-language').toArray;

// use cookies and query params to overwrite language selection

const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // one week

function getTld(host) {
  return host.slice(host.lastIndexOf('.') + 1);
}

function getSubdomain(host) {
  return host.slice(0, host.indexOf('.'));
}

module.exports = function (opts) {
  const supported = new Set(opts.supportedLanguages);
  supported.add(opts.defaultLanguage);

  return function overwrite(req, res, next) {
    if (req.lang) {
      debug('skip - language already detected:', req.lang);
      return next();
    }

    let hl;
    const tld = getTld(req.hostname);
    const subdomain = getSubdomain(req.hostname);
    if (supported.has(tld)) {
      hl = tld;
      debug('detected known TLD', hl);
    } else if (supported.has(subdomain)) {
      hl = subdomain;
      debug('detected by subdomain', hl);
    } else if (Object.hasOwn(req.query, 'hl')) {
      hl = req.query.hl;
      debug('detected query param %s on %s', hl, req.path);
      if (!hl) {
        debug('clear language selection cookie');
        res.clearCookie('hl');
      } else {
        res.cookie('hl', hl, {
          maxAge: MAX_AGE,
          secure: req.secure,
          sameSite: req.secure ? 'none' : 'lax'
        });
      }
    } else if (req.cookies.hl) {
      hl = req.cookies.hl;
      debug('detected cookie %s on %s', hl, req.path);
    }

    if (hl && supported.has(hl)) {
      debug('overwriting req.lang', hl);
      req.lang = hl;
      req.parsedLang = parseToArray(hl)[0];
      // q > 1 means we overrode Accept-Language selection
      req.parsedLang.q = 100;
    }

    next();
  };
};
