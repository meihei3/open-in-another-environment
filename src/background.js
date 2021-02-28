'use strict';

const ENV = {
  production: {
    id: 'production',
    title: 'Production',
    hostname: 'http://example.com',
  },
  staging: {
    id: 'staging',
    title: 'Staging',
    hostname: 'http://example.net',
  },
  development: {
    id: 'development',
    title: 'Development',
    hostname: 'http://example.edu',
  },
};

const openIn = (hostname, pageUrl) => {
  const url = new URL(pageUrl);
  chrome.tabs.update(null, { url: hostname + url.pathname + url.search });
};

chrome.runtime.onInstalled.addListener(() => {
  const parentId = chrome.contextMenus.create({
    id: 'parent',
    title: '別の環境で開く',
    contexts: ['all'],
    documentUrlPatterns: [
      ENV.production.hostname + '/*',
      ENV.staging.hostname + '/*',
      ENV.development.hostname + '/*',
    ],
  });

  Object.values(ENV).forEach((_env) => {
    chrome.contextMenus.create({
      id: _env.id,
      title: _env.title,
      parentId: parentId,
    });
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  switch (info.menuItemId) {
    case ENV.production.id:
      openIn(ENV.production.hostname, info.pageUrl);
      break;
    case ENV.staging.id:
      openIn(ENV.staging.hostname, info.pageUrl);
      break;
    case ENV.development.id:
      openIn(ENV.development.hostname, info.pageUrl);
      break;
    case 'parent':
      break;
    default:
      console.log('err: clicked undefined menu');
      break;
  }
});
