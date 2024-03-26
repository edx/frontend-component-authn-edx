import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import { AppProvider } from '@edx/frontend-platform/react';
import { initialize, subscribe, APP_READY } from '@edx/frontend-platform';

import './index.scss';
import BaseContainer from '../src/base-container'

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider>
      <BaseContainer open isPrivacyPolicy onClose={() => {}}>
        <div>Login Form</div>
      </BaseContainer> 
    </AppProvider>,
    document.getElementById('root'),
  );
});

initialize({
  messages: []
});
