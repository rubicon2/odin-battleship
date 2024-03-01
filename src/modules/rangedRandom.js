function rangedRandom(min, max) {
  if (min > max)
    throw new Error(
      `Min is ${min} and max is ${max}. Min should be less than max.`,
    );
  const range = max - min;
  return min + range * Math.random();
}

module.exports = rangedRandom;
