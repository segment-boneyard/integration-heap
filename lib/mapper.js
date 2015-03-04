/**
* Module dependencies.
*/

var reject = require('reject');

/**
 * Map `track`.
 *
 * @param {Track} track
 * @return {Object}
 * @api private
 */

exports.track = function(track){
  var props = track.properties({ email: '_email' });
  return {
    app_id: this.settings.appId,
    identity: track.userId(),
    event: track.event(),
    properties: reject.types(props, ['array', 'object', 'date'])
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
  var traits = identify.traits({ email: '_email' });
  return {
    app_id: this.settings.appId,
    identity: identify.userId(),
    properties: reject.types(traits, ['array', 'object', 'date'])
  };
};
