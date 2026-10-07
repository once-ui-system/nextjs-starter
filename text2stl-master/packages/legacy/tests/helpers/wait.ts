export default async function (time: number = 100): Promise<void> {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
