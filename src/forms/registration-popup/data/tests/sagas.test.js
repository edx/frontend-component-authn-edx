import { runSaga } from 'redux-saga';

import initializeMockLogging from '../../../../setupTest';
import {
  fetchRealtimeValidationsFailed, fetchRealtimeValidationsSuccess,
} from '../reducers';
import {
  fetchValidationsSaga,
} from '../sagas';
import * as api from '../service';

const { loggingService } = initializeMockLogging();

describe('fetchRealtimeValidations', () => {
  const params = {
    payload: {
      registrationFormData: {
        email: 'test@test.com',
        username: '',
        password: 'test-password',
        name: 'test-name',
        honor_code: true,
        country: 'test-country',
      },
    },
  };

  beforeEach(() => {
    loggingService.logInfo.mockReset();
  });

  const data = {
    validationDecisions: {
      username: 'Username must be between 2 and 30 characters long.',
    },
  };

  it('should call service and dispatch success action', async () => {
    const getFieldsValidations = jest.spyOn(api, 'getFieldsValidations')
      .mockImplementation(() => Promise.resolve({ fieldValidations: data }));

    const dispatched = [];
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      fetchValidationsSaga,
      params,
    );

    expect(getFieldsValidations).toHaveBeenCalledTimes(1);
    expect(dispatched).toEqual([
      fetchRealtimeValidationsSuccess(data),
    ]);
    getFieldsValidations.mockClear();
  });

  it('should call service and dispatch error action', async () => {
    const validationRatelimitResponse = {
      response: {
        status: 403,
        data: {
          detail: 'You do not have permission to perform this action.',
        },
      },
    };
    const getFieldsValidations = jest.spyOn(api, 'getFieldsValidations')
      .mockImplementation(() => Promise.reject(validationRatelimitResponse));

    const dispatched = [];
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      fetchValidationsSaga,
      params,
    );

    expect(getFieldsValidations).toHaveBeenCalledTimes(1);
    expect(loggingService.logInfo).toHaveBeenCalled();
    expect(dispatched).toEqual([
      fetchRealtimeValidationsFailed(),
    ]);
    getFieldsValidations.mockClear();
  });

  it('should call logError on 500 server error', async () => {
    const validationRatelimitResponse = {
      response: {
        status: 500,
        data: {},
      },
    };
    const getFieldsValidations = jest.spyOn(api, 'getFieldsValidations')
      .mockImplementation(() => Promise.reject(validationRatelimitResponse));

    const dispatched = [];
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      fetchValidationsSaga,
      params,
    );

    expect(getFieldsValidations).toHaveBeenCalledTimes(1);
    expect(loggingService.logError).toHaveBeenCalled();
    getFieldsValidations.mockClear();
  });
});
