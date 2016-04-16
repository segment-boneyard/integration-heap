'use strict';

/**
 * Module dependencies.
 */

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

exports.track = function(track) {
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

exports.identify = function(identify) {
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
  obj = traverse(obj);
  var ret = {};

  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      var value = obj[k];
      if (value == null) continue;

      // date
      if (is.date(value)) {
        ret[k] = value.toISOString();
        continue;
      }

      // not object
      if (value.toString() !== '[object Object]') {
        ret[k] = value.toString();
        continue;
      }

      // json
      // must flatten including the name of the original trait/property
      var nestedObj = {};
      nestedObj[k] = value;
      var flattenedObj = flatten(nestedObj, { safe: true });

      // stringify arrays inside nested object to be consistent with top level behavior of arrays
      for (var key in flattenedObj) {
        if (is.array(flattenedObj[key])) flattenedObj[key] = JSON.stringify(flattenedObj[key]);
      }

      ret = extend(ret, flattenedObj);
      delete ret[k];
    }
  }
  return ret;
}

