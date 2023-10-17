export const calcAverage = (arr) =>
  Math.round(arr.reduce((acc, cur, _, arr) => acc + cur / arr.length, 0));
