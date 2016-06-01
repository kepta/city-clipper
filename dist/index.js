#!/usr/bin/env node
'use strict';

exports.default = main;

var _turfInside = require('turf-inside');

var inside = _interopRequireDefault(_turfInside).default;

var _turfFeaturecollection = require('turf-featurecollection');

var featureC = _interopRequireDefault(_turfFeaturecollection).default;

var _jsonfile = require('jsonfile');

var writeFileSync = _jsonfile.writeFileSync;
var readFileSync = _jsonfile.readFileSync;

var _minimist = require('minimist');

var args = _interopRequireDefault(_minimist).default;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var argv = args(process.argv.slice(2));
if (argv.h || argv.help) {
  console.log('Usage: city-clipper --source <source.json> --city <city.json>');
} else if (argv.city || argv.source) {
  var city = readFileSync(argv.city);
  var source = readFileSync(argv.source);

  var ret = main(source, city);
  city.features.forEach(function (c, k) {
    return writeFileSync(c.properties.NAME + '.json', ret[k]);
  });
}

function createPoint(obj) {
  if (obj.geometry.type === 'Point') return obj;
  if (obj.geometry.type === 'LineString' || obj.geometry.type === 'MultiPoint') {
    return {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": obj.geometry.coordinates[0]
      }
    };
  }
  if (obj.geometry.type === 'MultiLineString' || obj.geometry.type === 'Polygon') {
    return {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": obj.geometry.coordinates[0][0]
      }
    };
  }
}

function main(source, cities, arg) {
  var _pointInCities = new Array(cities.features.length);
  for (var i = 0; i < cities.features.length; i++) {
    _pointInCities[i] = [];
  }
  source.features.forEach(function (o) {
    for (var _i = 0; _i < cities.features.length; _i++) {
      var found = inside(createPoint(o), cities.features[_i]);
      if (found) {
        _pointInCities[_i].push(o);
        break;
      }
    }
  });
  return _pointInCities.map(function (p) {
    return featureC(p);
  });
}
module.exports = exports['default'];