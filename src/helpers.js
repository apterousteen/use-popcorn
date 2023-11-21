export const calcAverage = (arr) =>
  Math.round(arr.reduce((acc, cur, _, arr) => acc + cur / arr.length, 0));

export const fieldExists = (field) => field !== 'N/A';
