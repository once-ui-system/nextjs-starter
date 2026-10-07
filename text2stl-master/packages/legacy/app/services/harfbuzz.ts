import Service from '@ember/service';
import hb from 'harfbuzzjs/hbjs';
import type { HBInstance } from 'harfbuzzjs/hbjs';

export default class HarfbuzzService extends Service {
  declare hb: HBInstance;

  loadWASMPromise: undefined | Promise<void> = undefined;

  async loadWASM() {
    if (!this.loadWASMPromise) {
      this.loadWASMPromise = this._loadWASM();
    }

    await this.loadWASMPromise;
  }

  async _loadWASM() {
    const result = await WebAssembly.instantiateStreaming(fetch('/hb.wasm'));
    this.hb = hb(result.instance);
  }
}

declare module '@ember/service' {
  interface Registry {
    harfbuzz: HarfbuzzService;
  }
}
