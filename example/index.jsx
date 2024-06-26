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
        INFO_EMAIL: process.env.INFO_EMAIL || '',
        LOGIN_ISSUE_SUPPORT_LINK: process.env.LOGIN_ISSUE_SUPPORT_LINK || '',
        ONBOARDING_COMPONENT_ENV: process.env.ONBOARDING_COMPONENT_ENV || '',
        PASSWORD_RESET_SUPPORT_LINK: process.env.PASSWORD_RESET_SUPPORT_LINK || '',
        PRIVACY_POLICY: process.env.PRIVACY_POLICY || '',
        TOS_AND_HONOR_CODE: process.env.TOS_AND_HONOR_CODE || '',
        USER_RETENTION_COOKIE_NAME: process.env.USER_RETENTION_COOKIE_NAME || '',
      });
    },
  },
});
