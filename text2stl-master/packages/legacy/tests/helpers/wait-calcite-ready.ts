type GenericCalciteElement = Element & {
  componentOnReady?: () => Promise<void>;
};

const MAX_TIMEOUT = 5000;
const TIME_SINCE_LAST_MUTATION = 1000;

export default async function waitCalciteReady(
  opt: { timeout: number } = { timeout: MAX_TIMEOUT },
) {
  // const start = new Date();

  // This does not seems to work as expected
  await waitAllCalciteComponentReady();
  // Use some workaround based on mutation observer to wait for page mutation end.
  await uiSettled(opt.timeout);

  // console.log('waitCalciteReady DONE', new Date().getTime() - start.getTime());
}

async function waitAllCalciteComponentReady() {
  const existingTagNames = [...document.querySelectorAll('*')].map((o) => o.tagName);
  const uniqTagNames = [...new Set([...existingTagNames]).values()];
  const calciteComponentName = uniqTagNames.filter((name) => name.startsWith('CALCITE'));

  await Promise.all(
    calciteComponentName.map(async (tagName) => {
      await customElements.whenDefined(tagName.toLowerCase());
      await Promise.all(
        [...document.querySelectorAll<GenericCalciteElement>(tagName)].map(async (e) => {
          await e.componentOnReady?.();
        }),
      );
    }),
  );
}

// Inspired from https://github.com/CrowdStrike/ember-url-hash-polyfill/blob/main/addon/index.ts ^^
async function uiSettled(timeout: number) {
  const timeStarted = new Date().getTime();
  let lastMutationAt = new Date().getTime();

  const observer = new MutationObserver(() => {
    lastMutationAt = new Date().getTime();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  /**
   * Wait for DOM mutations to stop until MAX_TIMEOUT
   */
  await new Promise((resolve) => {
    function requestTimeCheck() {
      requestAnimationFrame(() => {
        const timeSinceLastMutation = new Date().getTime() - lastMutationAt;

        if (new Date().getTime() - timeStarted >= timeout) {
          return resolve(null);
        }

        if (timeSinceLastMutation >= TIME_SINCE_LAST_MUTATION) {
          return resolve(null);
        }

        requestTimeCheck();
      });
    }

    requestTimeCheck();
  });
}
