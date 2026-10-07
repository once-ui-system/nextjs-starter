import { setAssetPath } from '@esri/calcite-components/dist/components';

import config from 'text2stl/config/environment';
const { rootURL, environment } = config;

const calciteAssetPath = ['development', 'test'].includes(environment)
  ? `${window.location.origin}${rootURL}assets/calcite/`
  : `${rootURL}assets/calcite/`;

setAssetPath(calciteAssetPath);

export function initialize() {}

export default {
  initialize,
};
