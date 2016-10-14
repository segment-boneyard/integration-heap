
var Test = require('segmentio-integration-tester');
var facade = require('segmentio-facade');
var helpers = require('./helpers');
var assert = require('assert');
var should = require('should');
var Track = facade.Track;
var Heap = require('..');

describe('Heap', function () {
  var heap;
  var settings;
  var payload;
  var test;

  beforeEach(function(){
    payload = {};
    settings = { appId: '1535634150' };
    heap = new Heap(settings);
    test = Test(heap, __dirname);
  });

  it('should the correct settings', function(){
    test
      .name('Heap')
      .endpoint('https://heapanalytics.com/api')
      .ensure('settings.appId')
      .ensure('message.userId')
      .channels(['mobile', 'server']);
  });

  describe('.validate()', function () {
    it('should be invalid without appId', function () {
      test.invalid({ userId: 'han' }, {});
    });

    it('should be valid with appId', function () {
      test.valid({ userId: 'han' }, settings);
    });

    it('should be invalid if message does not contain userId', function() {
      test.invalid({}, settings);
    });
  });

  describe('mapper', function(){
    describe('track', function(){
      it('should map correctly', function(){
        test.maps('track');
      });
    });

    describe('identify', function(){
      it('should map correctly', function(){
        test.maps('identify');
      });
    });
  });

  describe('.track()', function () {
    it('should return success', function (done) {
      var json = test.fixture('track');

      test
        .set(settings)
        .track(json.input)
        .sends(json.output)
        .expects(200, done);
    });

    it('should error on invalid creds', function(done){
      test
        .set({ appId: 'x' })
        .track(helpers.track())
        .error('Bad Request', done);
    });

    it('should convert dates into ISO string', function(done){
      var json = test.fixture('track');
      json.input.properties.date = new Date('2016');
      json.output.properties.date = '2016-01-01T00:00:00.000Z';

      test
        .set(settings)
        .track(json.input)
        .sends(json.output)
        .expects(200, done);
    });
  });

  describe('.identify()', function () {
    it('should return success', function (done) {
      var json = test.fixture('identify');

      test
        .set(settings)
        .identify(json.input)
        .sends(json.output)
        .expects(200, done);
    });

    it('should error on invalid creds', function(done){
      test
        .set({ appId: 'x' })
        .identify(helpers.identify())
        .error('Bad Request', done);
    });

    it('should convert dates into ISO string', function(done){
      var json = test.fixture('identify');
      json.input.traits.datetime = new Date('2016');
      json.output.properties.datetime = '2016-01-01T00:00:00.000Z';

      test
        .set(settings)
        .identify(json.input)
        .sends(json.output)
        .expects(200, done);
    });
  });
});
