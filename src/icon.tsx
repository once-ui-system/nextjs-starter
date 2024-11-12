

import { IconsGenerate } from 'dsv911/ez'

export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return IconsGenerate(size)
}
