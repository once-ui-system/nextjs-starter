import TextMakerSettings from 'text2stl/models/text-maker-settings';
import config from 'text2stl/config/environment';

const {
  APP: { textMakerDefault },
} = config;

export default function (props: Partial<TextMakerSettings>): TextMakerSettings {
  return new TextMakerSettings({
    ...textMakerDefault,
    ...props,
    supportPadding: { ...textMakerDefault.supportPadding, ...(props.supportPadding ?? {}) },
    handleSettings: { ...textMakerDefault.handleSettings, ...(props.handleSettings ?? {}) },
  });
}
