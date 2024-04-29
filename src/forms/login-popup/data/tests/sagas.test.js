import { camelCaseObject } from '@edx/frontend-platform';
import { runSaga } from 'redux-saga';

import { FORBIDDEN_REQUEST, INTERNAL_SERVER_ERROR } from '../../../../data/constants';
import initializeMockLogging from '../../../../setupTest';
import { loginUserFailed, loginUserSuccess } from '../reducers';
import saga, { handleUserLogin } from '../sagas';
import * as api from '../service';

const { loggingService } = initializeMockLogging();

describe('handleLoginRequest', () => {
  const params = {
    payload: {
      loginFormData: {
        email: 'test@test.com',
        password: 'test-password',
      },
    },
  };

  const testErrorResponse = async (loginErrorResponse, expectedLogFunc, expectedDispatchers) => {
    const loginRequest = jest.spyOn(api, 'default').mockImplementation(() => Promise.reject(loginErrorResponse));

    const dispatched = [];
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      handleUserLogin,
      params,
    );

    expect(loginRequest).toHaveBeenCalledTimes(1);
    expect(expectedLogFunc).toHaveBeenCalled();
    expect(dispatched).toEqual(expectedDispatchers);
    loginRequest.mockClear();
  };

  beforeEach(() => {
    loggingService.logError.mockReset();
    loggingService.logInfo.mockReset();
  });

  it('should call service and dispatch success action', async () => {
    const data = { redirectUrl: '/dashboard', success: true };
    const loginRequest = jest.spyOn(api, 'default')
      .mockImplementation(() => Promise.resolve(data));

    const dispatched = [];
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      handleUserLogin,
      params,
    );

    expect(loginRequest).toHaveBeenCalledTimes(1);
    expect(dispatched).toEqual([
      loginUserSuccess({ redirectUrl: data.redirectUrl, success: data.success }),
    ]);
    loginRequest.mockClear();
  });

  it('should call service and dispatch error action', async () => {
    const loginErrorResponse = {
      response: {
        status: 400,
        data: {
          login_error: 'something went wrong',
        },
      },
    };

    await testErrorResponse(loginErrorResponse, loggingService.logInfo, [
      loginUserFailed(camelCaseObject(loginErrorResponse.response.data)),
    ]);
  });

  it('should handle rate limit error code', async () => {
    const loginErrorResponse = {
      response: {
        status: 403,
        data: {
          errorCode: FORBIDDEN_REQUEST,
        },
      },
    };

    await testErrorResponse(loginErrorResponse, loggingService.logInfo, [
      loginUserFailed(loginErrorResponse.response.data),
    ]);
  });

  it('should handle 500 error code', async () => {
    const loginErrorResponse = {
      response: {
        status: 500,
        data: {
          errorCode: INTERNAL_SERVER_ERROR,
        },
      },
    };

    await testErrorResponse(loginErrorResponse, loggingService.logError, [
      loginUserFailed(loginErrorResponse.response.data),
    ]);
  });
});

describe('saga', () => {
  const gen = saga();

  it('should takeEvery loginUser', () => {
    expect(gen.next().value.type).toEqual('FORK');
  });
});
