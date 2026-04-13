export const dispatchEscape = (delay = 50) => {
  setTimeout(() => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
  }, delay);
};
