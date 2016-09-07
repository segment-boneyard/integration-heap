/**
* Module dependencies.
*/

var reject = require('reject');
var flatten = require('flat');
var traverse = require('isodate-traverse');
var is = require('is');
var extend = require('extend');

/**
 * Map `track`.
 *
 * @param {Track} track
 * @return {Object}
 * @api private
 */

exports.track = function(track){
  var props = clean(track.properties({ email: '_email' }));
  props.segment_library = track.proxy('context.library.name') || '';
  return {
    app_id: this.settings.appId,
    identity: track.userId(),
    event: track.event(),
    properties: props
  };
};

/**
 * Map `identify`.
 *
 * @param {Identify} identify
 * @return {Object}
 * @api private
 */

exports.identify = function(identify){
  var traits = clean(identify.traits({ email: '_email' }));
  traits.segment_library = identify.proxy('context.library.name') || '';
  return {
    app_id: this.settings.appId,
    identity: identify.userId(),
    properties: traits
  };
};

/**
 * Clean all nested objects and arrays.
 *
 * @param {Object} obj
 * @return {Object}
 * @api public
 */

function clean(obj) {
  var ret = {};

  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      var value = obj[k];
      // Heap's natively library will drop null and undefined properties anyway
      // so no need to send these
      // also prevents uncaught errors since we call .toString() on non objects
      if (value === null || value === undefined) continue;

      // date
      if (is.date(value)) {
        ret[k] = value.toISOString();
        continue;
      }

      // leave boolean as is
      if (is.bool(value)) {
        ret[k] = value;
        continue;
      }

      // leave  numbers as is
      if (is.number(value)) {
        ret[k] = value;
        continue;
      }

      // arrays of objects (eg. `products` array)
      if (toString.call(value) === '[object Array]') {
        ret = extend(ret, trample(k, value));
        continue;
      }

      // non objects
      if (toString.call(value) !== '[object Object]') {
        ret[k] = value.toString();
        continue;
      }

      ret = extend(ret, trample(k, value));
    }
  }
  // json
  // must flatten including the name of the original trait/property
  function trample(key, value) {
    var nestedObj = {};
    nestedObj[key] = value;
    var flattenedObj = flatten(nestedObj, { safe: true });

    // stringify arrays inside nested object to be consistent with top level behavior of arrays
    for (var k in flattenedObj) {
      if (is.array(flattenedObj[k])) flattenedObj[k] = JSON.stringify(flattenedObj[k]);
    }

    return flattenedObj;
  }

  return ret;
}

