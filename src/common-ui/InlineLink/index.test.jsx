import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import InlineLink from './index';

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

describe('InlineLink', () => {
  it('should render link with help text and trigger onClick when clicked', () => {
    const onClickMock = jest.fn();
    const { getByText } = render(
      <InlineLink
        linkText="Test Link"
        linkHelpText="Help text"
        onClick={onClickMock}
        destination="https://example.com"
      />,
    );

    const link = getByText('Test Link');
    const helpText = getByText('Help text');

    fireEvent.click(link);

    expect(onClickMock).toHaveBeenCalled();
    expect(helpText).toBeTruthy();
  });

  it('should render link with destination and not trigger onClick when clicked', () => {
    const { getByText } = render(
      <InlineLink
        linkText="Test Link"
        destination="https://example.com"
      />,
    );

    delete window.location;
    window.location = { href: 'http://base-url.com' };

    expect(window.location.href).toEqual('http://base-url.com');

    const link = getByText('Test Link');
    fireEvent.click(link);

    expect(window.location.href).toEqual('https://example.com');
  });
});
