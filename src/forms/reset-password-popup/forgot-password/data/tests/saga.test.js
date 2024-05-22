import { runSaga } from 'redux-saga';

import {
  forgotPasswordFailed,
  forgotPasswordForbidden,
  forgotPasswordSuccess,
} from '../reducers';
import { handleForgotPassword } from '../sagas';
import forgotPasswordService from '../service';

jest.mock('../service', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('handleForgotPassword', () => {
  it('should dispatch forgotPasswordSuccess action on successful service call', async () => {
    const payload = { email: 'test@test.com' };

    const serviceResponse = { status: 'success' };
    const forgotPasswordServiceMock = forgotPasswordService.mockResolvedValue(serviceResponse);

    const dispatched = [];
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      handleForgotPassword,
      { payload },
    );

    expect(forgotPasswordServiceMock).toHaveBeenCalledWith(payload);

    expect(dispatched).toEqual([
      forgotPasswordSuccess(payload),
    ]);

    forgotPasswordServiceMock.mockRestore();
  });

  it('should dispatch forgotPasswordForbidden action on 403 status response', async () => {
    const payload = { email: 'test@test.com' };

    const errorResponse = { response: { status: 403 } };
    forgotPasswordService.mockRejectedValue(errorResponse);

    const dispatched = [];
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      handleForgotPassword,
      { payload },
    );

    expect(dispatched).toEqual([
      forgotPasswordForbidden(),
    ]);
  });

  it('should dispatch forgotPasswordFailed action on other error responses', async () => {
    const payload = { email: 'test@test.com' };

    const errorResponse = { response: { status: 500 } };
    forgotPasswordService.mockRejectedValue(errorResponse);

    const dispatched = [];
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      handleForgotPassword,
      { payload },
    );

    expect(dispatched).toEqual([
      forgotPasswordFailed(),
    ]);
  });
});
