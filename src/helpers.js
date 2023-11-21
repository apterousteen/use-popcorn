export const calcAverage = (arr) =>
  Math.round(
    arr.reduce((acc, cur, _, arr) => {
      const checkedCur = Number.isFinite(cur) ? cur : 0;
      return acc + checkedCur / arr.length;
    }, 0)
  );

export const fieldExists = (field) => {
  return field !== 'N/A' && field !== 'NaN' && !Number.isNaN(field);
};

export const handleImgError = (event, hideImg = false) => {
  event.currentTarget.src =
    'https://img.icons8.com/ios-filled/50/adb5bd/movie.png';

  if (hideImg) event.currentTarget.className = 'imgHidden';
};
