import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import { AppProvider } from '@edx/frontend-platform/react';
import { initialize, subscribe, APP_READY } from '@edx/frontend-platform';

import './index.scss';

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider>
      <div>Load the forms here</div>
    </AppProvider>,
    document.getElementById('root'),
  );
});

initialize({
  messages: []
});
