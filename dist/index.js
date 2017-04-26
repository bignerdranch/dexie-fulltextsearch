(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lunr'), require('underscore.string')) :
	typeof define === 'function' && define.amd ? define(['exports', 'lunr', 'underscore.string'], factory) :
	(factory((global.dexieFullTextSearch = global.dexieFullTextSearch || {}),global.lunr,global.underscore_string));
}(this, (function (exports,lunr,underscore_string) { 'use strict';

lunr = 'default' in lunr ? lunr['default'] : lunr;

var intersection = ((a, b) => a.filter(v => b.indexOf(v) > -1));

function _asyncToGenerator$1(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var intersect = (() => {
  var _ref = _asyncToGenerator$1(function* (table, queries) {
    let results = yield Promise.all(queries.map(function (q) {
      return q.primaryKeys();
    }));

    let reduced = results.reduce(function (a, b) {
      let set = new Set(b);
      return a.filter(function (k) {
        return set.has(k);
      });
    });

    return table.where(':id').anyOf(reduced);
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

let index$1 = lunr(() => {});
index$1.pipeline.remove(lunr.stopWordFilter);

var tokenize = (text => index$1.pipeline.run(lunr.tokenizer(underscore_string.cleanDiacritics(text))).map(t => t.toString()));

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let tokensFor = (fields, object) => {
  fields = intersection(fields, Object.keys(object));

  let string = fields.map(field => {
    let value = object[field];
    if (typeof value === 'string') {
      return value;
    }
  }).join(' ');

  return tokenize(string);
};

let addFullText = (table, tokenField, fields) => {
  table.hook('creating', (_, obj) => {
    obj[tokenField] = tokensFor(fields, obj);
  });

  table.hook('updating', (mods, _, obj) => {
    return { [tokenField]: tokensFor(fields, _extends({}, obj, mods)) };
  });
};

var index$$1 = (() => {
  var _ref = _asyncToGenerator(function* (table, tokenField, query) {
    let tokens = tokenize(query);
    let queries = tokens.map(function (token) {
      return table.where(tokenField).startsWith(token);
    });

    return yield intersect(table, queries);
  });

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
})();

exports.addFullText = addFullText;
exports['default'] = index$$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));
