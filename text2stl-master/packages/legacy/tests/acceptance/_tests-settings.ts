import config from 'text2stl/config/environment';
import type { TextMakerSettingsParameters } from 'text2stl/models/text-maker-settings';

const {
  APP: { textMakerDefault },
} = config;

const testsSettingsOverride: Array<TextMakerSettingsParameters> = [
  // "Basic" text only
  {
    text: '123',
    size: 50,
    height: 5,
    spacing: 1,
  },
  {
    text: 'No default',
  },
  {
    text: 'this is a test',
    size: 72,
    height: 15,
    spacing: 10,
  },
  // "Basic" text with support
  {
    text: '123',
    size: 50,
    height: 5,
    spacing: 1,
    type: 2,
    supportHeight: 20,
    supportPadding: { top: 10, bottom: 10, left: 10, right: 10 },
  },
  {
    text: 'No default',
    type: 2,
  },
  {
    text: 'this is a test',
    size: 72,
    height: 15,
    spacing: 10,
    type: 2,
    supportHeight: 10,
    supportPadding: { top: 0, bottom: 0, left: 0, right: 0 },
  },
  // "Basic" negative text
  {
    text: '123',
    size: 50,
    height: 5,
    spacing: 1,
    type: 3,
    supportHeight: 20,
    supportPadding: { top: 10, bottom: 10, left: 10, right: 10 },
  },
  {
    text: 'No default',
    type: 3,
  },
  {
    text: 'this is a test',
    size: 72,
    height: 15,
    spacing: 10,
    type: 3,
    supportHeight: 10,
    supportPadding: { top: 0, bottom: 0, left: 0, right: 0 },
  },
  // "Basic" vertical text with support
  {
    text: '123',
    size: 50,
    height: 5,
    spacing: 1,
    type: 4,
    supportHeight: 20,
    supportPadding: { top: 10, bottom: 10, left: 10, right: 10 },
  },
  {
    text: 'No default',
    type: 4,
  },
  {
    text: 'this is a test',
    size: 72,
    height: 15,
    spacing: 10,
    type: 4,
    supportHeight: 10,
    supportPadding: { top: 0, bottom: 0, left: 0, right: 0 },
  },
  // Multi-line
  {
    text: 'multi\nline',
  },
  {
    text: 'multi\nline',
    vSpacing: 25,
  },
  // Alignment test
  {
    text: 'multi\nline',
    align: 'left',
  },
  {
    text: 'multi\nline',
    align: 'right',
  },
  // Various supportPadding
  {
    text: '123',
    type: 2,
    supportPadding: { top: 50, bottom: 5, left: 100, right: 10 },
  },
  {
    text: '123',
    type: 3,
    supportPadding: { top: 50, bottom: 5, left: 100, right: 10 },
  },
  {
    text: '123',
    type: 4,
    supportPadding: { top: 50, bottom: 5, left: 100, right: 10 },
  },
  {
    text: '123',
    type: 2,
    supportPadding: { top: 5, bottom: 50, left: 10, right: 100 },
  },
  {
    text: '123',
    type: 3,
    supportPadding: { top: 5, bottom: 50, left: 10, right: 100 },
  },
  {
    text: '123',
    type: 4,
    supportPadding: { top: 5, bottom: 50, left: 10, right: 100 },
  },
  // Without supportBorderRadius
  {
    text: 'No default',
    type: 2,
    supportBorderRadius: 0,
  },
  {
    text: 'No default',
    type: 3,
    supportBorderRadius: 0,
  },
  {
    text: 'No default',
    type: 4,
    supportBorderRadius: 0,
  },
  // With supportBorderRadius > max possible radius
  {
    text: 'No default',
    type: 2,
    supportBorderRadius: 100,
  },
  {
    text: 'No default',
    type: 3,
    supportBorderRadius: 100,
  },
  {
    text: 'No default',
    type: 4,
    supportBorderRadius: 100,
  },
  // With hole
  {
    text: 'No default',
    type: 2,
    handleSettings: {
      type: 'hole',
      position: 'top',
      size: 10,
      size2: 0,
      offsetY: -20,
      offsetX: 0,
    },
  },
  {
    text: 'No default',
    type: 2,
    handleSettings: {
      type: 'hole',
      position: 'left',
      size: 10,
      size2: 0,
      offsetY: -20,
      offsetX: 20,
    },
  },
  {
    text: 'No default',
    type: 3,
    handleSettings: {
      type: 'hole',
      position: 'bottom',
      size: 10,
      size2: 0,
      offsetY: -10,
      offsetX: 15,
    },
  },
  {
    text: 'No default',
    type: 3,
    handleSettings: {
      type: 'hole',
      position: 'left',
      size: 10,
      size2: 0,
      offsetY: -20,
      offsetX: 20,
    },
  },
  {
    text: 'No default',
    type: 4,
    handleSettings: {
      type: 'hole',
      position: 'top',
      size: 10,
      size2: 0,
      offsetY: -20,
      offsetX: 0,
    },
  },
  {
    text: 'No default',
    type: 4,
    handleSettings: {
      type: 'hole',
      position: 'left',
      size: 10,
      size2: 0,
      offsetY: -20,
      offsetX: 20,
    },
  },
  // With handle
  {
    text: 'No default',
    type: 2,
    handleSettings: {
      type: 'handle',
      position: 'top',
      size: 50,
      size2: 2,
      offsetY: -20,
      offsetX: 0,
    },
  },
  {
    text: 'No default',
    type: 2,
    handleSettings: {
      type: 'handle',
      position: 'left',
      size: 100,
      size2: 5,
      offsetY: -20,
      offsetX: 20,
    },
  },
  {
    text: 'No default',
    type: 3,
    handleSettings: {
      type: 'handle',
      position: 'bottom',
      size: 50,
      size2: 2,
      offsetY: -10,
      offsetX: 15,
    },
  },
  {
    text: 'No default',
    type: 3,
    handleSettings: {
      type: 'handle',
      position: 'left',
      size: 100,
      size2: 5,
      offsetY: -20,
      offsetX: 20,
    },
  },
  {
    text: 'No default',
    type: 4,
    handleSettings: {
      type: 'handle',
      position: 'top',
      size: 50,
      size2: 2,
      offsetY: -20,
      offsetX: 0,
    },
  },
  {
    text: 'No default',
    type: 4,
    handleSettings: {
      type: 'handle',
      position: 'left',
      size: 100,
      size2: 5,
      offsetY: -20,
      offsetX: 20,
    },
  },
  // vertical align test
  {
    vAlignment: 'top',
  },
  {
    vAlignment: 'bottom',
  },
  {
    text: 'multi\nline',
    vAlignment: 'top',
  },
  {
    text: 'multi\nline',
    vAlignment: 'bottom',
  },
  // Various font
  {
    text: 'multi\nline\nwith custom font',
    fontName: 'chango',
  },
].map((settings) => {
  return {
    ...textMakerDefault,
    ...settings,
    supportPadding: {
      ...textMakerDefault.supportPadding,
      ...(settings?.supportPadding ?? {}),
    },
    handleSettings: {
      ...textMakerDefault.handleSettings,
      ...(settings?.handleSettings ?? {}),
    },
  } as TextMakerSettingsParameters;
});

export default testsSettingsOverride;
