function array2D(size, defaultValue = null) {
  const arr = [];
  for (let x = 0; x < size; x += 1) {
    arr.push([]);
    for (let y = 0; y < size; y += 1) {
      arr[x].push(defaultValue);
    }
  }
  return arr;
}

module.exports = array2D;
