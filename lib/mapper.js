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
  var props = track.properties();
  return {
    app_id: this.settings.appId,
    identity: id(track),
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
  var traits = identify.traits();
  return {
    app_id: this.settings.appId,
    identity: id(identify),
    properties: reject.types(traits, ['array', 'object', 'date'])
  };
};

/**
 * Id.
 *
 * @param {Track} message
 * @return {String}
 * @api private
 */

function id(message){
  return message.email() || message.username() || message.userId();
}
