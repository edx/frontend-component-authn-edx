import React from 'react';
import { Provider } from 'react-redux';

import { getLocale, getMessages, IntlProvider } from '@edx/frontend-platform/i18n';

import store from './configureStore';
import { OnboardingComponentContext } from './storeHooks';

// eslint-disable-next-line react/prop-types
const OnBoardingProvider = ({ children }) => (
  <IntlProvider locale={getLocale()} messages={getMessages()}>
    <Provider context={OnboardingComponentContext} store={store}>
      {children}
    </Provider>
  </IntlProvider>
);

export default OnBoardingProvider;
