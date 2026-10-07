import Modifier from 'ember-modifier';
import type DefaultSignature from 'ember-modifier';
import type { ArgsFor } from 'ember-modifier';

import type { CalciteInputText } from '@esri/calcite-components/dist/components/calcite-input-text';
import { registerDestructor } from '@ember/destroyable';
import { action } from '@ember/object';

import type Owner from '@ember/owner';

export default class ThreeRendererModifier extends Modifier<DefaultSignature> {
  element?: CalciteInputText;

  constructor(owner: Owner, args: ArgsFor<DefaultSignature>) {
    super(owner, args);
    registerDestructor(this, this.cleanup);
  }

  @action
  onWHeel(e: WheelEvent) {
    if (!e.deltaY) {
      return;
    }

    const step = e.ctrlKey ? 10 : e.altKey ? 0.1 : 1;
    const factor = e.deltaY < 0 ? 1 : -1;
    const newValue = Number(parseFloat(this.element!.value) + step * factor).toFixed(2);

    this.element!.value = `${newValue}`;
    this.element!.dispatchEvent(new Event('calciteInputNumberChange'));

    e.preventDefault();
    e.stopPropagation();
  }

  @action
  cleanup() {
    this.element?.removeEventListener('wheel', this.onWHeel);
  }

  modify(element: CalciteInputText) {
    this.element = element;
    element.addEventListener('wheel', this.onWHeel);
  }
}
