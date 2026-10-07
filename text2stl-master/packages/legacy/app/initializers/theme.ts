export const DEFAULT_THEME = 'light';

export function initialize() {
  const theme = localStorage.getItem('theme') ?? DEFAULT_THEME;
  if (theme !== 'light') {
    document.querySelector('body')?.classList.add('calcite-mode-dark');
  }
}

export default {
  initialize,
};
