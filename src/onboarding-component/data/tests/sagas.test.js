import { runSaga } from 'redux-saga';

import initializeMockLogging from '../../../setupTest';
import { getThirdPartyAuthContextFailed, getThirdPartyAuthContextSuccess } from '../reducers';
import saga, { fetchThirdPartyAuthContextSaga } from '../sagas';
import * as api from '../service';

const { loggingService } = initializeMockLogging();

describe('fetchThirdPartyAuthContextSaga tests', () => {
  const params = { payload: { next: 'http://some-next-url.com' } };

  beforeEach(() => {
    loggingService.logError.mockReset();
    loggingService.logInfo.mockReset();
  });

  it('should call service and dispatch success action', async () => {
    const thirdPartyAuthContext = {
      autoSubmitRegForm: false,
      currentProvider: 'Google',
      finishAuthUrl: 'http://test-finish-auth.com',
      providers: ['Apple', 'Facebook', 'Google', 'Microsoft'],
      secondaryProviders: ['SAML1', 'SAML2'],
      pipelineUserDetails: { name: 'john doe', email: 'john_doe@example.com', username: 'john_doe' },
      errorMessage: null,
    };
    const fetchThirdPartyAuthContextMock = jest.spyOn(api, 'default')
      .mockImplementation(() => Promise.resolve({ thirdPartyAuthContext }));

    const dispatched = [];
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      fetchThirdPartyAuthContextSaga,
      params,
    );

    expect(fetchThirdPartyAuthContextMock).toHaveBeenCalledTimes(1);
    expect(dispatched).toEqual([
      getThirdPartyAuthContextSuccess(thirdPartyAuthContext),
    ]);
    fetchThirdPartyAuthContextMock.mockClear();
  });

  it('should call service and dispatch error action', async () => {
    const fetchThirdPartyAuthErrorResponse = {
      response: {
        status: 400,
      },
    };

    const fetchThirdPartyAuthContextMock = jest.spyOn(api, 'default')
      .mockImplementation(() => Promise.reject(fetchThirdPartyAuthErrorResponse));

    const dispatched = [];
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      fetchThirdPartyAuthContextSaga,
      params,
    );

    expect(fetchThirdPartyAuthContextMock).toHaveBeenCalledTimes(1);
    expect(dispatched).toEqual([
      getThirdPartyAuthContextFailed(),
    ]);
    expect(loggingService.logError).toHaveBeenCalled();
    fetchThirdPartyAuthContextMock.mockClear();
  });
});

describe('saga', () => {
  const gen = saga();

  it('should takeEvery getThirdPartyAuthContext', () => {
    expect(gen.next().value.type).toEqual('FORK');
  });
});
