import React from 'react';

import { render } from '@testing-library/react';

import AuthenticatedRedirection from '../AuthenticatedRedirection';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({ LMS_BASE_URL: 'http://example.com' })),
}));

describe('AuthenticatedRedirection', () => {
  const LMS_BASE_URL_MOCK = 'http://example.com';
  const mockFinishAuthUrl = '/finishAuth';
  const mockRedirectUrl = 'http://example.com/redirect';
  const mockSuccess = true;

  beforeEach(() => {
    delete window.location;
    window.location = { href: '' };
  });

  it('should not redirect if success is false', () => {
    render(
      <AuthenticatedRedirection
        finishAuthUrl={mockFinishAuthUrl}
        redirectUrl={mockRedirectUrl}
        success={false}
      />,
    );

    expect(window.location.href).toBe('');
  });

  it('should redirect to finishAuthUrl if provided and not already included in redirectUrl', () => {
    render(
      <AuthenticatedRedirection
        finishAuthUrl={mockFinishAuthUrl}
        redirectUrl={mockRedirectUrl}
        success={mockSuccess}
      />,
    );

    expect(window.location.href).toBe(`${LMS_BASE_URL_MOCK}${mockFinishAuthUrl}`);
  });

  it('should redirect to redirectUrl if finishAuthUrl is not provided or already included in redirectUrl', () => {
    render(
      <AuthenticatedRedirection
        finishAuthUrl={null}
        redirectUrl={mockRedirectUrl + mockFinishAuthUrl} // finishAuthUrl already included
        success={mockSuccess}
      />,
    );

    expect(window.location.href).toBe(`${mockRedirectUrl + mockFinishAuthUrl}`);
  });
});
