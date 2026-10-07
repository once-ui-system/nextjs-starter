import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import type FileExporterService from 'text2stl/services/file-exporter';
import type { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import type { Mesh } from 'three';

module('Unit | Service | file-exporter', function (hooks) {
  setupTest(hooks);

  // eslint-disable-next-line qunit/require-expect
  test(`downloadMeshFile works [STL]`, function (assert) {
    assert.expect(5);
    const service = this.owner.lookup('service:file-exporter') as FileExporterService;
    const done = assert.async();

    service.downloadBlob = async function (blob: Blob, name: string) {
      assert.strictEqual(blob.type, 'application/octet-stream', 'blob has correct type');
      assert.strictEqual(name, 'output.stl', 'blob has correct name');
      assert.strictEqual(await blob.text(), 'stl_content', 'blob contains STL');
      done();
    };

    service.stlExporter = {
      parse(mesh: string, args: { binary: boolean }) {
        assert.strictEqual(mesh, 'a_mesh', 'IT calls STLExporter with mesh');
        assert.true(args.binary, 'It calls STLExporter with correct binary option');
        return 'stl_content';
      },
    } as unknown as STLExporter;

    service.downloadMeshFile('a_mesh' as unknown as Mesh, 'stl');
  });

  // eslint-disable-next-line qunit/require-expect
  test(`downloadMeshFile works [OBJ]`, function (assert) {
    assert.expect(4);
    const service = this.owner.lookup('service:file-exporter') as FileExporterService;
    const done = assert.async();

    service.downloadBlob = async function (blob: Blob, name: string) {
      assert.strictEqual(blob.type, 'text/plain', 'blob has correct type');
      assert.strictEqual(name, 'output.obj', 'blob has correct name');
      assert.strictEqual(await blob.text(), 'obj_content', 'blob contains OBJ');
      done();
    };

    service.objExporter = {
      parse(mesh: string) {
        assert.strictEqual(mesh, 'a_mesh', 'IT calls OBJExporter with mesh');
        return 'obj_content';
      },
    } as unknown as STLExporter;

    service.downloadMeshFile('a_mesh' as unknown as Mesh, 'obj');
  });
});
