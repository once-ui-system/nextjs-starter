import { helper } from '@ember/component/helper';

export function floatToFixed([value, count = 2]: [string, number]) {
  return Number.parseFloat(value).toFixed(count);
}

export default helper(floatToFixed);
