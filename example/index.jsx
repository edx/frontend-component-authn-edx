import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import { initialize, subscribe, APP_READY } from '@edx/frontend-platform';

import './index.scss';
import AuthnExampleContainer from './authn-example'

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AuthnExampleContainer />,
    document.getElementById('root'),
  );
});

initialize({
  messages: []
});
