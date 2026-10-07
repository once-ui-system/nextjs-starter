import Component from '@glimmer/component';
import * as THREE from 'three';

interface TreePreviewSizeArgs {
  mesh?: THREE.Mesh;
}

interface MeshSize {
  x: number;
  y: number;
  z: number;
}

export default class TreePreviewSize extends Component<TreePreviewSizeArgs> {
  get meshSize(): MeshSize | undefined {
    if (!this.args.mesh) {
      return undefined;
    }

    const { min, max } = new THREE.Box3().setFromObject(this.args.mesh as THREE.Object3D);
    return {
      x: max.x - min.x,
      y: max.y - min.y,
      z: max.z - min.z,
    };
  }
}
