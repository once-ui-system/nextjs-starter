import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { DEFAULT_THEME } from 'text2stl/initializers/theme';

interface ThemeSwitcherArgs {}

type Theme = 'dark' | 'light';

export default class ThemeSwitcher extends Component<ThemeSwitcherArgs> {
  @tracked _theme: Theme;

  get theme(): Theme {
    return this._theme;
  }

  set theme(theme: Theme) {
    localStorage.setItem('theme', theme);
    this._theme = theme;

    if (theme !== 'light') {
      document.querySelector('body')?.classList.add('calcite-mode-dark');
    } else {
      document.querySelector('body')?.classList.remove('calcite-mode-dark');
    }
  }

  get isDarkTheme() {
    return this.theme === 'dark';
  }

  get isLightTheme() {
    return this.theme === 'light';
  }

  constructor(owner: unknown, args: ThemeSwitcherArgs) {
    super(owner, args);

    const theme = localStorage.getItem('theme') ?? DEFAULT_THEME;
    this._theme = theme === 'light' ? 'light' : 'dark';
  }

  @action
  switchTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
  }
}
