import { readFileSync } from 'jsonfile';
const path = require('path');

export function getJSON(name) {
  return readFileSync(path.join(__dirname, name));
}

export function createLineString(coords) {
  return {
   "type": "FeatureCollection",
   "features": [
      {
       "type": "Feature",
       "geometry": {"type": "Point", "coordinates": [102.0, 0.5]},
       "properties": {"prop0": "value0"}
      },
      ...(() =>
        coords.map(c => {
          return {
              "type": "Feature",
              "geometry": {
                "type": "LineString",
                "coordinates": [
                    c, [20, 30]
                  ]
                },
              "properties": {
                "prop0": "value0",
                "prop1": 0.0
                }
            }
        }
        )
      )()
    ]
  }
}


export function createMultiLine(coords) {
  // console.log(cords);
  return {
   "type": "FeatureCollection",
   "features": [
     { "type": "Feature",
       "geometry": {"type": "Point", "coordinates": [102.0, 0.5]},
       "properties": {"prop0": "value0"}
       },
      ...(() =>
        coords.map(c => {
          return {
              "type": "Feature",
              "geometry": {
                "type": "MultiLineString",
                "coordinates": [
                    [c, [23.3, 25.2], [30, 40]],
                    [[40, 51], [23.23, 20], [10, 10]]
                  ]
                },
              "properties": {
                "prop0": "value0",
                "prop1": 0.0
                }
            }
        }
        )
      )()
      ]
  }
}

export function createCity(coords) {
  return {
      "type": "FeatureCollection",
      "features": (() => coords.map(c => {
        return {
         "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              c
             ]
         },
          "properties": {
            "prop0": "value0",
            "prop1": {"this": "that"}
          }
       }
      }))()
  };
}

export function concatGeos(a, b) {
  return {
    "type": "FeatureCollection",
    "features": [
      ...a.features, ...b.features
    ]
  };
}
