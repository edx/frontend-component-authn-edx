import { runSaga } from 'redux-saga';

import { INTERNAL_SERVER_ERROR } from '../../../../data/constants';
import initializeMockLogging from '../../../../setupTest';
import { saveUserProfileFailure, saveUserProfileSuccess } from '../reducers';
import saga, { handleSaveUserProfile } from '../sagas';
import * as api from '../services';

const { loggingService } = initializeMockLogging();

describe('handleSaveUserProfile', () => {
  const params = {
    payload: {
      username: 'edX',
      data: {
        extended_profile: [
          { field_name: 'subject', field_value: 'English' },
        ],
        gender: 'm',
        level_of_education: 'none',
      },
    },
  };

  const testErrorResponse = async (saveUserProfileErrorResponse, expectedLogFunc, expectedDispatchers) => {
    const patchAccount = jest.spyOn(api, 'default').mockImplementation(() => Promise.reject(saveUserProfileErrorResponse));

    const dispatched = [];
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      handleSaveUserProfile,
      params,
    );

    expect(patchAccount).toHaveBeenCalledTimes(1);
    expect(expectedLogFunc).toHaveBeenCalled();
    expect(dispatched).toEqual(expectedDispatchers);
    patchAccount.mockClear();
  };

  beforeEach(() => {
    loggingService.logError.mockReset();
  });

  it('should call service and dispatch success action', async () => {
    const patchAccount = jest.spyOn(api, 'default')
      .mockImplementation(() => Promise.resolve({ success: 200 }));

    const dispatched = [];
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      handleSaveUserProfile,
      params,
    );

    expect(patchAccount).toHaveBeenCalledTimes(1);
    expect(dispatched).toEqual([
      saveUserProfileSuccess(),
    ]);
    patchAccount.mockClear();
  });

  it('should call service and dispatch error action', async () => {
    const saveUserProfileErrorResponse = {
      response: {
        status: 400,
        data: {
          error: 'something went wrong',
        },
      },
    };

    await testErrorResponse(saveUserProfileErrorResponse, loggingService.logError, [
      saveUserProfileFailure(),
    ]);
  });

  it('should handle 500 error code', async () => {
    const saveUserProfileErrorResponse = {
      response: {
        status: 500,
        data: {
          errorCode: INTERNAL_SERVER_ERROR,
        },
      },
    };

    await testErrorResponse(saveUserProfileErrorResponse, loggingService.logError, [
      saveUserProfileFailure(),
    ]);
  });
});

describe('saga', () => {
  const gen = saga();

  it('should takeEvery saveUserProfile', () => {
    expect(gen.next().value.type).toEqual('FORK');
  });
});
