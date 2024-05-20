import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';

import {
  APP_READY, initialize, mergeConfig, subscribe,
} from '@edx/frontend-platform';

import './index.scss';
import AuthnExampleContainer from './authn-example';

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AuthnExampleContainer />,
    document.getElementById('root'),
  );
});

initialize({
  messages: [],
  handlers: {
    config: () => {
      mergeConfig({
        AUTHN_ALGOLIA_APP_ID: process.env.AUTHN_ALGOLIA_APP_ID || '',
        AUTHN_ALGOLIA_SEARCH_API_KEY: process.env.AUTHN_ALGOLIA_SEARCH_API_KEY || '',
        AUTHN_TOS_AND_HONOR_CODE_LINK: process.env.AUTHN_TOS_AND_HONOR_CODE_LINK || '',
        AUTHN_PRIVACY_POLICY_LINK: process.env.AUTHN_PRIVACY_POLICY_LINK || '',
        INFO_EMAIL: process.env.INFO_EMAIL || '',
      });
    },
  },
});
