const rangedRandom = require('../modules/rangedRandom');

describe.only('ranged random', () => {
  test('number is within range between 0 and 1', () => {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < 1000; i += 1) {
      const random = rangedRandom(0, 1);
      if (random < min) min = random;
      if (random > max) max = random;
    }
    expect(min).toBeGreaterThanOrEqual(0);
    expect(max).toBeLessThanOrEqual(1);
  });

  test('number is within range between -5 and 5', () => {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < 1000; i += 1) {
      const random = rangedRandom(-5, 5);
      if (random < min) min = random;
      if (random > max) max = random;
    }
    expect(min).toBeGreaterThanOrEqual(-5);
    expect(max).toBeLessThanOrEqual(5);
  });

  test('number is correct when given same min and max', () => {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < 1000; i += 1) {
      const random = rangedRandom(1, 1);
      if (random < min) min = random;
      if (random > max) max = random;
    }
    expect(min).toBe(1);
    expect(max).toBe(1);
  });

  test('throws error if min is greater than max', () => {
    expect(() => rangedRandom(5, 0)).toThrow();
  });

  test('test throws error if any arguments are not numerical', () => {
    expect(() => rangedRandom('hur', 'dur')).toThrow();
  });
});
