import React from 'react';

import { IntlProvider } from '@edx/frontend-platform/i18n';
import { render } from '@testing-library/react';

import ThirdPartyAuthAlert from '../ThirdPartyAuthAlert';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({ SITE_NAME: 'edX' })),
}));

describe('ThirdPartyAuthAlert', () => {
  const mockCurrentProvider = 'Google';
  const mockPlatformName = 'edX';

  const intlWrapper = children => (
    <IntlProvider locale="en">{children}</IntlProvider>
  );

  it('should render alert message for login form', () => {
    const { getByText } = render(intlWrapper(
      <ThirdPartyAuthAlert currentProvider={mockCurrentProvider} referrer="login" />,
    ));

    const expectedMessage = `You have successfully signed into ${mockCurrentProvider}, but your ${mockCurrentProvider} `
      + `account does not have a linked ${mockPlatformName} account. To link your accounts, `
      + `sign in now using your ${mockPlatformName} password.`;

    expect(getByText(expectedMessage)).toBeTruthy();
  });

  it('should render alert message for registration form', () => {
    const { getByText } = render(intlWrapper(
      <ThirdPartyAuthAlert currentProvider={mockCurrentProvider} referrer="register" />,
    ));

    const expectedMessage = `You've successfully signed into ${mockCurrentProvider}! We just need a little more information `
      + `before you start learning with ${mockPlatformName}.`;

    expect(getByText(expectedMessage)).toBeTruthy();
  });

  it('should not render alert if currentProvider is not provided', () => {
    const { queryByText } = render(intlWrapper(
      <ThirdPartyAuthAlert currentProvider={null} referrer="login" />,
    ));

    const expectedMessage = `You have successfully signed into ${mockCurrentProvider}, but your ${mockCurrentProvider} `
      + `account does not have a linked ${mockPlatformName} account. To link your accounts, `
      + `sign in now using your ${mockPlatformName} password.`;

    expect(queryByText(expectedMessage)).toBeFalsy();
  });
});
