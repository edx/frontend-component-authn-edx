import { runSaga } from 'redux-saga';

import initializeMockLogging from '../../../../../setupTest';
import { setShowPasswordResetBanner } from '../../../../login-popup/data/reducers';
import { forgotPasswordTokenInvalidFailure } from '../../../forgot-password/data/reducers';
import { PASSWORD_RESET, PASSWORD_VALIDATION_ERROR } from '../constants';
import {
  resetPasswordFailure,
  resetPasswordSuccess,
  validatePasswordFailure,
  validatePasswordSuccess,
  validateTokenFailed,
  validateTokenSuccess,
} from '../reducers';
import { handleResetPassword, handleValidatePassword, handleValidateToken } from '../sagas';
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
    }), forgotPasswordTokenInvalidFailure(PASSWORD_RESET.INVALID_TOKEN)]);
    resetPasswordRequest.mockClear();
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
    },
  };

  const responseData = {
    is_valid: true,
  };

  beforeEach(() => {
    loggingService.logError.mockReset();
    loggingService.logInfo.mockReset();
  });

  it('should call service and dispatch success action', async () => {
    const validateTokenRequest = jest.spyOn(api, 'validateTokenRequest')
      .mockImplementation(() => Promise.resolve(responseData));

    const dispatched = [];
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      handleValidateToken,
      params,
    );

    expect(dispatched).toEqual([validateTokenSuccess(responseData.is_valid, params.payload)]);
    validateTokenRequest.mockClear();
  });

  it('should call service and dispatch invalid token error', async () => {
    responseData.is_valid = false;

    const validateTokenRequest = jest.spyOn(api, 'validateTokenRequest')
      .mockImplementation(() => Promise.resolve(responseData));

    const dispatched = [];
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      handleValidateToken,
      params,
    );

    expect(dispatched).toEqual([
      validateTokenFailed(PASSWORD_RESET.INVALID_TOKEN),
      forgotPasswordTokenInvalidFailure(PASSWORD_RESET.INVALID_TOKEN),
    ]);
    validateTokenRequest.mockClear();
  });

  it('should call service and dispatch internal server error', async () => {
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

    expect(loggingService.logError).toHaveBeenCalled();
    expect(dispatched).toEqual([
      validateTokenFailed(PASSWORD_RESET.INTERNAL_SERVER_ERROR),
      forgotPasswordTokenInvalidFailure(PASSWORD_RESET.INTERNAL_SERVER_ERROR),
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
      forgotPasswordTokenInvalidFailure(PASSWORD_RESET.FORBIDDEN_REQUEST),
    ]);
    validateTokenRequest.mockClear();
  });
});

describe('handleValidatePassword', () => {
  const params = {
    payload: {
      password: 'new_password1',
    },
  };

  const responseData = 'Password validation success';

  beforeEach(() => {
    loggingService.logError.mockReset();
    loggingService.logInfo.mockReset();
  });

  it('should call service and dispatch success action', async () => {
    const validatePasswordRequest = jest.spyOn(api, 'validatePasswordRequest')
      .mockImplementation(() => Promise.resolve(responseData));

    const dispatched = [];
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      handleValidatePassword,
      params,
    );

    expect(dispatched).toEqual([validatePasswordSuccess(responseData)]);
    validatePasswordRequest.mockClear();
  });

  it('should call service and dispatch internal server error', async () => {
    const errorResponse = {
      response: {
        status: 500,
        data: {
          errorCode: PASSWORD_RESET.INTERNAL_SERVER_ERROR,
        },
      },
    };
    const validatePasswordRequest = jest.spyOn(api, 'validatePasswordRequest')
      .mockImplementation(() => Promise.reject(errorResponse));

    const dispatched = [];
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      handleValidatePassword,
      params,
    );

    expect(loggingService.logError).toHaveBeenCalled();
    expect(dispatched).toEqual([validatePasswordFailure()]);
    validatePasswordRequest.mockClear();
  });

  it('should call service and dispatch reset password failure with specific error', async () => {
    const errorResponse = {
      response: {
        status: 200,
        data: {
          errorCode: PASSWORD_VALIDATION_ERROR,
        },
      },
    };
    const resetPasswordRequest = jest.spyOn(api, 'resetPasswordRequest')
      .mockImplementation(() => Promise.resolve(errorResponse));

    const dispatched = [];
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      handleResetPassword,
      params,
    );

    expect(dispatched).toEqual([
      resetPasswordFailure({
        status: PASSWORD_VALIDATION_ERROR,
      }),
    ]);
    resetPasswordRequest.mockClear();
  });
});
