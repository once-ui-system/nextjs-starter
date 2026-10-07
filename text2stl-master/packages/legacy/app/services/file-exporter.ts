import Service from '@ember/service';
import { STLExporter } from 'text2stl/misc/threejs/STLExporter';
import { OBJExporter } from 'text2stl/misc/threejs/OBJExporter';

import type { Mesh } from 'three';

export type FileType = 'stl' | 'obj';

export default class FileExporterService extends Service {
  stlExporter = new STLExporter();
  objExporter = new OBJExporter();

  meshToSTLBlob(mesh: Mesh, binary: boolean): Blob {
    const result = this.stlExporter.parse(mesh, { binary });
    return new Blob([result], {
      type: binary ? 'application/octet-stream' : 'text/plain',
    });
  }

  meshToOBJBlob(mesh: Mesh): Blob {
    const result = this.objExporter.parse(mesh);
    return new Blob([result], {
      type: 'text/plain',
    });
  }

  downloadBlob(blob: Blob, name: string) {
    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);

    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
  }

  downloadMeshFile(mesh: Mesh, type: FileType = 'stl') {
    let blob: Blob;

    switch (type) {
      case 'obj':
        blob = this.meshToOBJBlob(mesh);
        break;
      default:
      case 'stl':
        blob = this.meshToSTLBlob(mesh, true);
        break;
    }

    this.downloadBlob(blob, `output.${type}`);
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'file-exporter': FileExporterService;
  }
}
