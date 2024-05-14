import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';

import { APP_READY, initialize, subscribe } from '@edx/frontend-platform';

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
});
