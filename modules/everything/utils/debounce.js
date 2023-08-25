let timeoutId;

const debounce = (func, delay) => {
  if (!delay) {
    delay = 300;
  }
  clearTimeout(timeoutId);
  timeoutId = setTimeout(func, delay);
};
