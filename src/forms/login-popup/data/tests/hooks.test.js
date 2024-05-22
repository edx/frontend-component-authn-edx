import { renderHook } from '@testing-library/react-hooks';

import useGetActivationMessage from '../hooks';

describe('useGetActivationMessage hooks', () => {
  test('should remove the account activation param from url', () => {
    const href = 'localhost:2999/login';
    delete window.location;
    window.history.replaceState = jest.fn();
    window.location = { href: `${href}?account_activation_status=success` };

    renderHook(useGetActivationMessage);
    expect(window.history.replaceState).toHaveBeenCalledTimes(1);
  });
});
