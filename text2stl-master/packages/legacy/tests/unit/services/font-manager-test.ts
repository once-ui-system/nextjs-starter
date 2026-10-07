import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import type FontManagerService from 'text2stl/services/font-manager';
import type { Variant, FaceAndFont } from 'text2stl/services/font-manager';

const mockedFontList = new Map();

mockedFontList.set('font1', {
  files: {
    regular: 'font1_regular.ttf',
  },

  variants: ['regular'],
});
mockedFontList.set('font2', {
  files: {
    italic: 'font2_italic.ttf',
    regular: 'font2_regular.ttf',
  },

  variants: ['regular', 'italic'],
});
mockedFontList.set('font3', {
  files: {
    italic: 'font2_italic.ttf',
  },

  variants: ['regular'],
});

module('Unit | Service | font-manager', function (hooks) {
  setupTest(hooks);

  for (const { fontName, variantName, expectedFontUrl, title } of [
    {
      fontName: 'font2',
      variantName: undefined,
      expectedFontUrl: 'font2_regular.ttf',
      title: 'Font name without variant',
    },
    {
      fontName: 'font2',
      variantName: '800' as Variant,
      expectedFontUrl: 'font2_regular.ttf',
      title: 'Font name with unknow variant',
    },
    {
      fontName: 'font2',
      variantName: 'italic' as Variant,
      expectedFontUrl: 'font2_italic.ttf',
      title: 'Font name with variant',
    },
  ]) {
    // eslint-disable-next-line qunit/require-expect
    test(`it fetch font [${title}]`, async function (assert) {
      assert.expect(3);
      const service = this.owner.lookup('service:font-manager') as FontManagerService;
      service.fontList = mockedFontList;

      service.fetch = async function (input: RequestInfo): Promise<Response> {
        assert.strictEqual(input, expectedFontUrl, 'It fetch the correct font');
        return {
          arrayBuffer: () => 'fetched-array-buffer',
        } as unknown as Response;
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      service.openHBFont = (buffer: ArrayBuffer): FaceAndFont => {
        assert.strictEqual(`${buffer}`, 'fetched-array-buffer', 'font is parsed with fetch result');
        return 'parsed-font' as unknown as FaceAndFont;
      };

      const font = await service.fetchFont(fontName, variantName);
      assert.strictEqual(`${font}`, 'parsed-font', 'correct font is returned');
    });
  }

  for (const { fontName, variantName, title } of [
    {
      fontName: 'Something',
      variantName: 'regular' as Variant,
      title: 'Unknown font name',
    },
    {
      fontName: 'font3',
      variantName: 'regular' as Variant,
      title: 'Font name with variant + unexisting files',
    },
  ]) {
    test(`it throw error when font can't be load  [${title}]`, async function (assert) {
      const service = this.owner.lookup('service:font-manager') as FontManagerService;
      service.fontList = mockedFontList;

      try {
        await service.fetchFont(fontName, variantName);
        assert.true(false);
      } catch (e) {
        assert.true(true);
      }
    });
  }

  test('it cache font', async function (assert) {
    const fetchDone = assert.async();
    const parseDone = assert.async();

    const service = this.owner.lookup('service:font-manager') as FontManagerService;
    service.fontList = mockedFontList;

    service.fetch = async function (): Promise<Response> {
      fetchDone();
      return {
        arrayBuffer: () => {},
      } as Response;
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    service.openHBFont = (): FaceAndFont => {
      parseDone();
      return 'a-parsed-font' as unknown as FaceAndFont;
    };

    let font = await service.fetchFont('font1');
    assert.strictEqual(`${font}`, 'a-parsed-font', 'Font is returned');

    font = await service.fetchFont('font1');
    assert.strictEqual(`${font}`, 'a-parsed-font', 'Font is returned');
  });

  // eslint-disable-next-line qunit/require-expect
  test('it can load custom font file', async function (assert) {
    assert.expect(2);

    const service = this.owner.lookup('service:font-manager') as FontManagerService;

    const mockedBlob = {
      async arrayBuffer() {
        return 'a_great_boeuf-er';
      },
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    service.openHBFont = (buffer: ArrayBuffer): FaceAndFont => {
      assert.strictEqual(
        buffer as unknown as string,
        'a_great_boeuf-er',
        'blob buffer is passed to opentype.parse',
      );
      return 'a-parsed-font' as unknown as FaceAndFont;
    };

    const font = await service.loadCustomFont(mockedBlob as unknown as Blob);
    assert.strictEqual(`${font}`, 'a-parsed-font', 'Font is returned');
  });
});
