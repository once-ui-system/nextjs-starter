import config from 'text2stl/config/environment';
const { gTag, environment } = config;

export function initialize() {
  if (!gTag?.forceEnable && ['development', 'test'].includes(environment)) {
    // Just define gtag function to prevent dev/test to fail
    fakeGtag();
    return;
  } else if (!gTag?.tag) {
    console.error('no GTAG defined, skipping Gtag script load');
    return;
  }

  injectGtag();
  initGtag();
}

async function injectGtag() {
  const script = document.createElement('script');
  script.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${gTag?.tag}`);
  document.body.appendChild(script);
}

function initGtag() {
  const script = document.createElement('script');
  script.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gTag?.tag}');
`;

  // Append the script tag to the document.
  document.body.appendChild(script);
}

function fakeGtag() {
  const script = document.createElement('script');
  script.innerHTML = `function gtag(){}`;

  // Append the script tag to the document.
  document.body.appendChild(script);
}

export default {
  initialize,
};
