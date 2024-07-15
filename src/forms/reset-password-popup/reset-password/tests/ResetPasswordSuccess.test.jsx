import React from 'react';

import { render } from '@testing-library/react';

import ResetPasswordSuccess from '../components/ResetPasswordSuccess';
import messages from '../messages';

jest.mock('@edx/frontend-platform/i18n', () => ({
  useIntl: () => ({
    formatMessage: jest.fn((message) => message.defaultMessage),
  }),
  // eslint-disable-next-line no-shadow
  defineMessages: (messages) => messages,
}));

describe('ResetPasswordSuccess component', () => {
  it('renders success alert with correct message', () => {
    const { getByText } = render(<ResetPasswordSuccess />);
    const successMessage = messages.resetPasswordSuccess.defaultMessage;

    // Assert that the success message is in the document
    expect(getByText(successMessage)).toBeTruthy();
  });
});
