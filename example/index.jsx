import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import { initialize, subscribe, APP_READY } from '@edx/frontend-platform';

import './index.scss';
import AuthnComponent from "../src/authn-component";

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AuthnComponent setOpen={()=>{}} open={true} />,
    document.getElementById('root'),
  );
});

initialize({
  messages: []
});
