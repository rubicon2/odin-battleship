const array2D = require('../modules/array2d');

describe('array2D', () => {
  test('correctly generate array2D of size 2', () => {
    const arr = array2D(2);
    expect(arr).toStrictEqual([
      [null, null],
      [null, null],
    ]);
  });

  test('correctly generate array2D with a custom default value', () => {
    const arr = array2D(2, 'blob');
    expect(arr).toStrictEqual([
      ['blob', 'blob'],
      ['blob', 'blob'],
    ]);
  });

  test('correctly generate array2D of size 10', () => {
    const arr = array2D(10);
    expect(arr).toStrictEqual([
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
    ]);
  });

  test('array access', () => {
    const arr = array2D(10, 'blob');
    expect(arr[0][0]).toBeDefined();
    expect(arr[9][9]).toBeDefined();
    expect(arr[9][10]).toBeUndefined();
  });
});
