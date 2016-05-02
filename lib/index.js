
/**
 * Module dependencies.
 */

var integration = require('segmentio-integration');
var mapper = require('./mapper');

/**
 * Expose `Heap`
 */

var Heap = module.exports = integration('Heap')
  .endpoint('https://heapanalytics.com/api')
  .channels(['server', 'mobile'])
  .ensure('settings.appId')
  .mapper(mapper)
  .retries(2);

/**
 * Reject events older than 15 minutes
 */ 

Heap.ensure(function(msg){
  var time = Date.now() - Date.parse(msg.timestamp());
  if (time > 900000) return this.invalid('timestamp is older than 15 minutes');
});

/**
 * Track.
 *
 * @param {Track} track
 * @param {Function} fn
 * @api public
 */

Heap.prototype.track = function(payload, fn){
  return this
    .post('/track')
    .type('json')
    .send(payload)
    .end(this.handle(fn));
};

/**
 * Identify.
 *
 * @param {Identify} identify
 * @param {Function} fn
 * @api public
 */

Heap.prototype.identify = function(payload, fn){
  return this
    .post('/add_user_properties')
    .type('json')
    .send(payload)
    .end(this.handle(fn));
};
