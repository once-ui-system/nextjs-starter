import { triggerEvent } from '@ember/test-helpers';
import type { CalciteInputText } from '@esri/calcite-components/dist/components/calcite-input-text';

export default async function fillCalciteInput(selector: string, value: string) {
  const e = document.querySelector(selector) as CalciteInputText;
  e.value = value;
  await triggerEvent(e, 'calciteInputTextInput');
  await triggerEvent(e, 'calciteTextAreaInput');
  await triggerEvent(e, 'calciteInputNumberChange');
}
