import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import FontManagerService from 'text2stl/services/font-manager';
import TextMakerService from 'text2stl/services/text-maker';
import FileExporterService from 'text2stl/services/file-exporter';
import { tracked } from '@glimmer/tracking';
import { trackedFunction } from 'ember-resources/util/function';
import { Registry as Services } from '@ember/service';

import type ApplicationRoute from 'text2stl/routes/app/generator';
import type IntlService from 'ember-intl/services/intl';
import type { FileType } from 'text2stl/services/file-exporter';

export default class GeneratorController extends Controller {
  queryParams = ['modelSettings'];

  // Serialize model settings as QP
  get modelSettings() {
    return this.model?.serialize() ?? '';
  }

  set modelSettings(_value: string) {
    // Nothing needed here, model is update :
    // By route according to QP when route is loaded
    // By components for later update
  }

  @service declare textMaker: TextMakerService;

  @service declare fontManager: FontManagerService;

  @service declare fileExporter: FileExporterService;

  @service declare intl: IntlService;

  @service declare router: Services['router'];

  _gtag = gtag;

  declare model: RouteModel<ApplicationRoute>;

  font = trackedFunction(this, async () => {
    return this.model.customFont
      ? this.fontManager.loadCustomFont(this.model.customFont)
      : this.fontManager.fetchFont(this.model.fontName, this.model.variantName);
  });

  mesh = trackedFunction(this, () => {
    if (this.font.isResolved && this.font.value) {
      this._gtag('event', 'stl_generation', {
        event_category: 'stl', // eslint-disable-line camelcase
        value: this.model.type,
      });

      return this.textMaker.generateMesh(this.model, this.font.value);
    }

    return null;
  });

  get meshGenerating() {
    return this.mesh.isLoading;
  }

  get exportDisabled() {
    return !this.mesh.value;
  }

  @tracked isFontLoading = true;

  @tracked fileType: FileType = 'stl';

  fileTypes: FileType[] = ['stl', 'obj'];

  get exportFileLabel() {
    return this.intl.t('export_file', { type: this.fileType.toUpperCase() });
  }

  @action
  changeFileType(fileType: FileType) {
    this.fileType = fileType;
  }

  @action
  async exportFile() {
    const { value: mesh } = await this.mesh;

    if (!mesh) {
      return;
    }

    this._gtag('event', 'file_download', {
      event_category: 'file', // eslint-disable-line camelcase
      value: this.fileType,
    });

    this.fileExporter.downloadMeshFile(mesh, this.fileType);
  }

  @tracked saveModalVisible = false;

  get currentUrl() {
    return window.location.href;
  }

  @action
  showSaveModal() {
    this.saveModalVisible = true;
  }

  @action
  hideSaveModal() {
    this.saveModalVisible = false;
  }

  @tracked resetModalVisible = false;

  @action
  async resetModel() {
    // Reset "modelSettings"
    await this.router.transitionTo(this.router.currentRouteName, this.intl.locale[0], {
      queryParams: { modelSettings: '' },
    });

    // Force refreshing model
    await this.router.refresh('app');
    this.hideResetModal();
  }

  @action
  showResetModal() {
    this.resetModalVisible = true;
  }

  @action
  hideResetModal() {
    this.resetModalVisible = false;
  }

  @tracked mainPanelClosed = false;

  @action
  closeMainPanel() {
    this.mainPanelClosed = true;
  }

  @action
  openMainPanel() {
    this.mainPanelClosed = false;
  }
}

declare module '@ember/controller' {
  interface Registry {
    'app.generator': GeneratorController;
  }
}
