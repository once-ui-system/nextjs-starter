export {}
export default function ImageLoader({
    src,
    width,
    quality,
  }: {
    src: any;
    width: any;
    quality: any;
  }) {
    return `${src}?w=${width}&q=${quality || 75}`;
  }
  