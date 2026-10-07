declare module "harfbuzzjs/hbjs.js" {
  const createHarfBuzz: (instance: WebAssembly.Instance) => unknown;
  export default createHarfBuzz;
}