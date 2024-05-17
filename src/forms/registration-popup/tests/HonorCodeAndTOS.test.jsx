import React from 'react';

import { mergeConfig } from '@edx/frontend-platform';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import { fireEvent, render } from '@testing-library/react';

import HonorCodeAndPrivacyPolicyMessage from '../honorCodeAndTOS';

const IntlHonorCodeAndTOS = injectIntl(HonorCodeAndPrivacyPolicyMessage);
const mockWindow = window;

jest.mock('@openedx/paragon', () => ({
  // eslint-disable-next-line react/prop-types
  Hyperlink: ({ children, destination, onClick }) => (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a
      href={destination}
      onClick={(e) => {
        if (onClick) { onClick(e); }
        mockWindow.location.href = destination;
      }}
    >
      {children}
    </a>
  ),
}));

describe('HonorCodeAndPrivacyPolicyMessage Tests', () => {
  mergeConfig({
    AUTHN_TOS_AND_HONOR_CODE_LINK: process.env.AUTHN_TOS_AND_HONOR_CODE_LINK,
    AUTHN_PRIVACY_POLICY_LINK: process.env.AUTHN_PRIVACY_POLICY_LINK,
  });

  it('should render honor code and terms of service link and redirect on click', () => {
    const redirectUrl = 'http://localhost:18000/honor';
    const { getByText } = render(
      <IntlProvider locale="en">
        <IntlHonorCodeAndTOS />
      </IntlProvider>,
    );

    delete window.location;
    window.location = { href: 'http://base-url.com' };

    const honorCodeAndTOSLink = getByText('Terms of Service and Honor Code');
    expect(honorCodeAndTOSLink.getAttribute('href')).toBe(redirectUrl);

    fireEvent.click(honorCodeAndTOSLink);

    expect(window.location.href).toEqual(redirectUrl);
  });

  it('should render privacy policy link and redirect on click', () => {
    const redirectUrl = 'http://localhost:18000/privacy';
    const { getByText } = render(
      <IntlProvider locale="en">
        <IntlHonorCodeAndTOS />
      </IntlProvider>,
    );

    delete window.location;
    window.location = { href: 'http://base-url.com' };

    const privacyPolicyLink = getByText('Privacy Policy');
    expect(privacyPolicyLink.getAttribute('href')).toBe(redirectUrl);

    fireEvent.click(privacyPolicyLink);
    expect(window.location.href).toEqual(redirectUrl);
  });
});
