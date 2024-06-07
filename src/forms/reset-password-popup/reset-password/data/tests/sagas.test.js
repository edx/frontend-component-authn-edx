import { runSaga } from 'redux-saga';

import initializeMockLogging from '../../../../../setupTest';
import { setShowPasswordResetBanner } from '../../../../login-popup/data/reducers';
import { forgotPassweordTokenInvalidFailure } from '../../../forgot-password/data/reducers';
import { PASSWORD_RESET } from '../constants';
import {
  resetPasswordFailure,
  resetPasswordSuccess,
  validateTokenFailed,
} from '../reducers';
import { handleResetPassword, handleValidateToken } from '../sagas';
import * as api from '../service';

const { loggingService } = initializeMockLogging();

describe('handleResetPassword', () => {
  const params = {
    payload: {
      formPayload: {
        new_password1: 'new_password1',
        new_password2: 'new_password1',
      },
      token: 'token',
      params: {},
    },
  };

  const responseData = {
    reset_status: true,
    err_msg: '',
  };

  beforeEach(() => {
    loggingService.logError.mockReset();
    loggingService.logInfo.mockReset();
  });

  it('should call service and dispatch success action', async () => {
    const resetPasswordRequest = jest.spyOn(api, 'resetPasswordRequest')
      .mockImplementation(() => Promise.resolve(responseData));

    const dispatched = [];
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      handleResetPassword,
      params,
    );

    expect(dispatched).toEqual([resetPasswordSuccess(true), setShowPasswordResetBanner()]);
    resetPasswordRequest.mockClear();
  });

  it('should call service and dispatch internal server error action', async () => {
    const errorResponse = {
      response: {
        status: 500,
        data: {
          errorCode: PASSWORD_RESET.INTERNAL_SERVER_ERROR,
        },
      },
    };
    const resetPasswordRequest = jest.spyOn(api, 'resetPasswordRequest')
      .mockImplementation(() => Promise.reject(errorResponse));

    const dispatched = [];
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      handleResetPassword,
      params,
    );

    expect(loggingService.logError).toHaveBeenCalled();
    expect(dispatched).toEqual([resetPasswordFailure({
      status: PASSWORD_RESET.INTERNAL_SERVER_ERROR,
    })]);
    resetPasswordRequest.mockClear();
  });

  it('should call service and dispatch invalid token error', async () => {
    responseData.reset_status = false;
    responseData.token_invalid = true;

    const resetPasswordRequest = jest.spyOn(api, 'resetPasswordRequest')
      .mockImplementation(() => Promise.resolve(responseData));

    const dispatched = [];
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      handleResetPassword,
      params,
    );
    expect(dispatched).toEqual([resetPasswordFailure({
      status: PASSWORD_RESET.INVALID_TOKEN,
    }), forgotPassweordTokenInvalidFailure(PASSWORD_RESET.INVALID_TOKEN)]);
    resetPasswordRequest.mockClear();
  });

  it('should call service and dispatch ratelimit error', async () => {
    const errorResponse = {
      response: {
        status: 429,
        data: {
          errorCode: PASSWORD_RESET.FORBIDDEN_REQUEST,
        },
      },
    };
    const resetPasswordRequest = jest.spyOn(api, 'resetPasswordRequest')
      .mockImplementation(() => Promise.reject(errorResponse));

    const dispatched = [];
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      handleResetPassword,
      params,
    );

    expect(loggingService.logInfo).toHaveBeenCalled();
    expect(dispatched).toEqual([resetPasswordFailure({
      status: PASSWORD_RESET.FORBIDDEN_REQUEST,
    })]);
    resetPasswordRequest.mockClear();
  });
});
describe('handleValidateToken', () => {
  const params = {
    payload: {
      token: 'token',
      params: {},
    },
  };

  beforeEach(() => {
    loggingService.logError.mockReset();
    loggingService.logInfo.mockReset();
  });

  it('check internal server error on api failure', async () => {
    const errorResponse = {
      response: {
        status: 500,
        data: {
          errorCode: PASSWORD_RESET.INTERNAL_SERVER_ERROR,
        },
      },
    };
    const validateTokenRequest = jest.spyOn(api, 'validateTokenRequest')
      .mockImplementation(() => Promise.reject(errorResponse));

    const dispatched = [];
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      handleValidateToken,
      params,
    );

    expect(dispatched).toEqual([validateTokenFailed(PASSWORD_RESET.INTERNAL_SERVER_ERROR),
      forgotPassweordTokenInvalidFailure(PASSWORD_RESET.INTERNAL_SERVER_ERROR),
    ]);
    validateTokenRequest.mockClear();
  });

  it('should call service and dispatch rate limit error', async () => {
    const errorResponse = {
      response: {
        status: 429,
        data: {
          errorCode: PASSWORD_RESET.FORBIDDEN_REQUEST,
        },
      },
    };
    const validateTokenRequest = jest.spyOn(api, 'validateTokenRequest')
      .mockImplementation(() => Promise.reject(errorResponse));

    const dispatched = [];
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      handleValidateToken,
      params,
    );

    expect(loggingService.logInfo).toHaveBeenCalled();
    expect(dispatched).toEqual([
      validateTokenFailed(PASSWORD_RESET.FORBIDDEN_REQUEST),
      forgotPassweordTokenInvalidFailure(PASSWORD_RESET.FORBIDDEN_REQUEST),
    ]);
    validateTokenRequest.mockClear();
  });
});
