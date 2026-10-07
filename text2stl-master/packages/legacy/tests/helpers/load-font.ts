import fonts from 'text2stl/tests/fixtures/fonts';

export default async function (name: string): Promise<ArrayBuffer> {
  const res = await fetch(fonts[name]);
  return await res.arrayBuffer();
}
