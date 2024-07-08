import React from 'react';
import { Provider } from 'react-redux';
import { getLocale, getMessages, IntlProvider } from '@edx/frontend-platform/i18n';
import store from './configureStore';
import { AuthnContext } from './storeHooks';

// eslint-disable-next-line react/prop-types
const AuthnProvider = _ref => {
  let {
    children
  } = _ref;
  return /*#__PURE__*/React.createElement(IntlProvider, {
    locale: getLocale(),
    messages: getMessages()
  }, /*#__PURE__*/React.createElement(Provider, {
    context: AuthnContext,
    store: store
  }, children));
};
export default AuthnProvider;
//# sourceMappingURL=authnProvider.js.map