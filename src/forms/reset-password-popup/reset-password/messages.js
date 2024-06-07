import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  // alert banner strings
  resetPasswordFormSubmissionError: {
    id: 'reset.password.form.submission.error',
    defaultMessage: 'Please check your responses and try again.',
    description: 'Error message for reset password page',
  },
  resetPassowrdSuccess: {
    id: 'reset.password.success',
    defaultMessage: 'Your password has been reset. Sign in to your account.',
    description: 'Reset password success message',
  },
  internalServerError: {
    id: 'internal.server.error',
    defaultMessage: 'An error has occurred. Try refreshing the page, or check your internet connection.',
    description: 'Error message that appears when server responds with 500 error code',
  },
  rateLimitError: {
    id: 'rate.limit.error',
    defaultMessage: 'An error has occurred because of too many requests. Please try again after some time.',
    description: 'Error message that appears when server responds with 429 error code',
  },
});

export default messages;
