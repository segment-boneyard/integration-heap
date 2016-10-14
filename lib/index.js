
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
  .ensure('message.userId') // Heap drops all anonymous events anyway so no need to send without this
  .mapper(mapper)
  .retries(2);

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
