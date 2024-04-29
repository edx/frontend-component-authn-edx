import {
  COMPLETE_STATE, DEFAULT_STATE, PENDING_STATE,
} from '../../../data/constants';
import commonDataReducer, {
  clearThirdPartyAuthContextErrorMessage,
  commonDataInitialState,
  getThirdPartyAuthContext,
  getThirdPartyAuthContextFailed,
  getThirdPartyAuthContextSuccess,
} from '../reducers';

describe('commonDataSlice reducer', () => {
  it('should return the initial state', () => {
    expect(commonDataReducer(undefined, {})).toEqual(commonDataInitialState);
  });

  it('should handle getThirdPartyAuthContext action', () => {
    const nextState = commonDataReducer(commonDataInitialState, getThirdPartyAuthContext());

    expect(nextState.thirdPartyAuthApiStatus).toEqual(PENDING_STATE);
  });

  it('should handle getThirdPartyAuthContextSuccess action', () => {
    const mockPayload = {
      autoSubmitRegForm: false,
      currentProvider: 'Google',
      finishAuthUrl: 'http://test-finish-auth.com',
      providers: ['Apple', 'Facebook', 'Google', 'Microsoft'],
      secondaryProviders: ['SAML1', 'SAML2'],
      pipelineUserDetails: { name: 'john doe', email: 'john_doe@example.com', username: 'john_doe' },
      errorMessage: null,
    };

    const nextState = commonDataReducer(commonDataInitialState, getThirdPartyAuthContextSuccess(mockPayload));

    expect(nextState.thirdPartyAuthApiStatus).toEqual(COMPLETE_STATE);
    expect(nextState.thirdPartyAuthContext).toEqual(mockPayload);
  });

  it('should handle getThirdPartyAuthContextFailed action', () => {
    const nextState = commonDataReducer(commonDataInitialState, getThirdPartyAuthContextFailed());

    expect(nextState.thirdPartyAuthApiStatus).toEqual(DEFAULT_STATE);
    expect(nextState.thirdPartyAuthContext.errorMessage).toBeNull();
  });

  it('should handle clearThirdPartyAuthContextErrorMessage action', () => {
    const nextState = commonDataReducer(commonDataInitialState, clearThirdPartyAuthContextErrorMessage());

    expect(nextState.thirdPartyAuthContext.errorMessage).toBeNull();
  });
});
