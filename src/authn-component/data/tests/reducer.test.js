import {
  COMPLETE_STATE, FAILURE_STATE, LOGIN_FORM, PENDING_STATE,
} from '../../../data/constants';
import commonDataReducer, {
  commonDataInitialState,
  getThirdPartyAuthContext,
  getThirdPartyAuthContextFailed,
  getThirdPartyAuthContextSuccess,
  setCurrentOpenedForm,
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

    expect(nextState.thirdPartyAuthApiStatus).toEqual(FAILURE_STATE);
    expect(nextState.thirdPartyAuthContext.errorMessage).toBeNull();
  });

  it('should handle setCurrentOpenedForm action', () => {
    const nextState = commonDataReducer(commonDataInitialState, setCurrentOpenedForm(LOGIN_FORM));

    expect(nextState.currentForm).toEqual(LOGIN_FORM);
  });
});
