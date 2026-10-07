export type StringPart = {
  type: 'text' | 'emoji';
  value: string;
};

export default function extractEmoji(str: string) {
  const emojiRE = /(\p{EPres}|\p{ExtPict})+/gu;

  const extraction: StringPart[] = [];
  const execList: RegExpExecArray[] = [];
  let exec: RegExpExecArray | null = null;

  while ((exec = emojiRE.exec(str))) {
    execList.push(exec);
  }

  // No emoji at all
  if (!execList.length) {
    extraction.push({
      type: 'text',
      value: str,
    });
  } else {
    if (execList[0].index) {
      extraction.push({
        type: 'text',
        value: str.substring(0, execList[0].index),
      });
    }

    for (const [i, e] of execList.entries()) {
      extraction.push({
        type: 'emoji',
        value: e[0],
      });

      const eLength = e[0].length; // Emoji lenght
      const eEndIdx = e.index + eLength; // Emoji end index in string
      const nextEmojiIdx = execList[i + 1]?.index ?? 0; // Next emoji index

      // Handle text between current emoji & next one
      if (nextEmojiIdx > eEndIdx) {
        extraction.push({
          type: 'text',
          value: str.substring(eEndIdx, execList[i + 1].index),
        });
      }
      // Handle text between last emoji & end of string
      else if (i === execList.length - 1 && eEndIdx < str.length) {
        extraction.push({
          type: 'text',
          value: str.substring(eEndIdx, str.length),
        });
      }
    }
  }

  return extraction;
}
