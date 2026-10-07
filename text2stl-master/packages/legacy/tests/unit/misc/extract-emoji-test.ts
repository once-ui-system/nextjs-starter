import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import extractEmoji, { type StringPart } from 'text2stl/misc/extract-emoji';

module('Unit | Misc | extract-emoji', function (hooks) {
  setupTest(hooks);

  test(`It extract emoji & text from string`, function (assert) {
    assert.deepEqual(extractEmoji('🤍Hello !🔥'), [
      {
        type: 'emoji',
        value: '🤍',
      },
      {
        type: 'text',
        value: 'Hello !',
      },
      {
        type: 'emoji',
        value: '🔥',
      },
    ] as StringPart[]);
  });

  test(`It extract emoji & text from string`, function (assert) {
    assert.deepEqual(extractEmoji('Hello !🔥'), [
      {
        type: 'text',
        value: 'Hello !',
      },
      {
        type: 'emoji',
        value: '🔥',
      },
    ] as StringPart[]);
  });

  test(`It extract emoji & text from string`, function (assert) {
    assert.deepEqual(extractEmoji('🤍Hello !'), [
      {
        type: 'emoji',
        value: '🤍',
      },
      {
        type: 'text',
        value: 'Hello !',
      },
    ] as StringPart[]);
  });

  test(`It extract emoji & text from string`, function (assert) {
    assert.deepEqual(extractEmoji('He😍llo !'), [
      {
        type: 'text',
        value: 'He',
      },
      {
        type: 'emoji',
        value: '😍',
      },
      {
        type: 'text',
        value: 'llo !',
      },
    ] as StringPart[]);
  });

  test(`It extract multiple emojis as single part`, function (assert) {
    assert.deepEqual(extractEmoji('He😍😍😍😍llo !'), [
      {
        type: 'text',
        value: 'He',
      },
      {
        type: 'emoji',
        value: '😍😍😍😍',
      },
      {
        type: 'text',
        value: 'llo !',
      },
    ] as StringPart[]);
  });

  test(`It works when there's only emojis`, function (assert) {
    assert.deepEqual(extractEmoji('😍😍😍😍'), [
      {
        type: 'emoji',
        value: '😍😍😍😍',
      },
    ] as StringPart[]);
  });

  test(`It works when there's not emojis`, function (assert) {
    assert.deepEqual(extractEmoji('Hello !'), [
      {
        type: 'text',
        value: 'Hello !',
      },
    ] as StringPart[]);
  });

  test(`It works on "complex" string`, function (assert) {
    assert.deepEqual(extractEmoji('This ❌ h🅰s some 😱😱😱😱 emojis inside 🤔'), [
      {
        type: 'text',
        value: 'This ',
      },
      {
        type: 'emoji',
        value: '❌',
      },
      {
        type: 'text',
        value: ' h',
      },
      {
        type: 'emoji',
        value: '🅰',
      },
      {
        type: 'text',
        value: 's some ',
      },
      {
        type: 'emoji',
        value: '😱😱😱😱',
      },
      {
        type: 'text',
        value: ' emojis inside ',
      },
      {
        type: 'emoji',
        value: '🤔',
      },
    ] as StringPart[]);
  });
});
