/* eslint-disable camelcase */
import chango from './chango';
import open_sans from './open_sans';
import NotoEmojiRegular from './NotoEmoji-Regular';

// base64 -i font.ttf -o tmp.txt
export default {
  chango,
  open_sans,
  Roboto: open_sans, // Default, for test purpose
  'NotoEmoji-Regular': NotoEmojiRegular,
} as Record<string, string>;
