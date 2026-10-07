import { helper } from '@ember/component/helper';

export function plus([value, add = 1]: [number, number]) {
  return Number(value) + Number(add);
}

export default helper(plus);
