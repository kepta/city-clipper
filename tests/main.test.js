import { expect } from 'chai';
import main from '../src';
import {getJSON, createCity, createLineString, concatGeos, createMultiLine} from './helper';
// const cities = getJSON('cities.json');
// const source = getJSON('source.json');


describe('config 1', () => {
  const cities = createCity([
    [[20.0, 20.0], [70.0, 20.0], [20.0, 70.0], [20.0, 20.0]],
    [[2, 3], [4, 5], [6, 6], [2, 3]]
  ]);
  const source = createLineString([[22, 40], [40, 40], [60, 24]]);
  it('city 1 should have 3 match', () => {
    expect(main(source, cities)[0].features.length).to.be.equal(3);

  })
  it('city2 shold not have any match', () => {
    expect(main(source, cities)[1].features.length).to.be.equal(0);
  })

});

describe('multiple cities', () => {
  const cities = createCity([
    [
      [20.0, 20.0], [30.0, 20.0], [20.0, 30.0], [20.0, 20.0]
    ],
    [
      [2, 3], [4, 5], [6, 6], [2, 3]
    ],
    [
      [40.0, 40.0], [60.0, 40.0], [40.0, 60.0], [40.0, 40.0]
    ],
  ]);
  const source = createLineString([[22, 40], [41, 41], [60, 24]]);
  // console.log(JSON.stringify(concatGeos(cities, source), null, 2));
  it('should pass test 1', () => {
    const ret = main(source, cities);
    expect(main(source, cities)[0].features.length).to.be.equal(0);
    expect(main(source, cities)[1].features.length).to.be.equal(0);
    expect(main(source, cities)[2].features.length).to.be.equal(1);
  })

});

describe('multiple cities multi points', () => {
  const cities = createCity([
    [
      [20.0, 20.0], [30.0, 20.0], [20.0, 30.0], [20.0, 20.0]
    ],
    [
      [2, 3], [14, 2], [10, 6], [2, 3]
    ],
    [
      [40.0, 40.0], [60.0, 40.0], [40.0, 60.0], [40.0, 40.0]
    ],
  ]);
  const source = createLineString([[22, 40], [41, 41], [60, 24], [10, 4], [2, 4]]);
  // console.log(JSON.stringify(concatGeos(cities, source), null, 2));
  it('should pass test 1', () => {
    const ret = main(source, cities);
    expect(main(source, cities)[0].features.length).to.be.equal(0);
    expect(main(source, cities)[1].features.length).to.be.equal(1);
    expect(main(source, cities)[2].features.length).to.be.equal(1);
  })

});

describe('handle MultiLineString', () => {
  const cities = createCity([
    [
      [20.0, 20.0], [30.0, 20.0], [20.0, 30.0], [20.0, 20.0]
    ],
    [
      [2, 3], [14, 2], [10, 6], [2, 3]
    ],
    [
      [40.0, 40.0], [60.0, 40.0], [40.0, 60.0], [40.0, 40.0]
    ],
  ]);
  const source = concatGeos(createLineString([[10, 4], [2, 4]]), createMultiLine([[22, 40], [41, 41]]));

  it('should pass test 1', () => {
    const ret = main(source, cities);
    expect(main(source, cities)[0].features.length).to.be.equal(0);
    expect(main(source, cities)[1].features.length).to.be.equal(1);
    expect(main(source, cities)[2].features.length).to.be.equal(1);
  })

});
