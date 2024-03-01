const rangedRandomInt = require('../modules/rangedRandomInt');

test('rangedRandomInt returns an integer', () => {
  expect(Number.isInteger(rangedRandomInt(-5, 5))).toBe(true);
});

test('integer is within range between -1 and 1', () => {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (let i = 0; i < 1000; i += 1) {
    const random = rangedRandomInt(-1, 1);
    if (random < min) min = random;
    if (random > max) max = random;
  }
  expect(min).toBeGreaterThanOrEqual(-1);
  expect(max).toBeLessThanOrEqual(1);
});
