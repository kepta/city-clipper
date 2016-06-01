#!/usr/bin/env node

import inside from 'turf-inside';
import featureC from 'turf-featurecollection';
import { writeFileSync, readFileSync } from 'jsonfile';
import args from 'minimist';

var argv = args(process.argv.slice(2));
if (argv.h || argv.help) {
  console.log('Usage: city-clipper --source <source.json> --city <city.json>');
} else if (argv.city || argv.source) {
  var city = readFileSync(argv.city);
  var source = readFileSync(argv.source);

  var ret = main(source, city);
  city.features.forEach((c, k) => writeFileSync(c.properties.NAME + '.json', ret[k]));
}


function createPoint(obj) {
      if (obj.geometry.type === 'Point') return obj;
      if (obj.geometry.type === 'LineString' || obj.geometry.type === 'MultiPoint') {
        return {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": obj.geometry.coordinates[0],
          }
        };
      }
      if (obj.geometry.type === 'MultiLineString' || obj.geometry.type === 'Polygon') {
        return {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": obj.geometry.coordinates[0][0],
          }
        };
      }
}

export default function main(source, cities, arg) {
  var _pointInCities = new Array(cities.features.length);
  for(let i = 0 ; i< cities.features.length ; i++) {
    _pointInCities[i] = [ ];
  }
  source.features.forEach((o) => {
    for(let i = 0; i < cities.features.length; i++) {
      let found = inside(createPoint(o), cities.features[i]);
      if (found) {
        _pointInCities[i].push(o);
        break;
      }
    }
  });
  return _pointInCities.map(p => featureC(p));
}
