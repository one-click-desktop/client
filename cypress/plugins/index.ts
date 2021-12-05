// Plugins enable you to tap into, modify, or extend the internal behavior of Cypress
// For more info, visit https://on.cypress.io/plugins-api
module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, args) => {
    console.log(config, browser, args);
    if (browser.name === 'chrome') {
      args.push(
        '--disable-features=CrossSiteDocumentBlockingIfIsolating,CrossSiteDocumentBlockingAlways,IsolateOrigins,site-per-process'
      );
      args.push(
        '--load-extension=cypress/extensions/Ignore-X-Frame-headers_v1.1'
      );
    }
    return args;
  });
};
