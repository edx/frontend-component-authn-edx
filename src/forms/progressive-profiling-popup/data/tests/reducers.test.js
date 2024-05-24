import {
  COMPLETE_STATE, FAILURE_STATE, PENDING_STATE,
} from '../../../../data/constants';
import progressiveProfilingReducer, {
  progressiveProfilingInitialState,
  saveUserProfile,
  saveUserProfileFailure,
  saveUserProfileSuccess,
} from '../reducers';

describe('progressiveProfilingSlice reducer', () => {
  it('should return the initial state', () => {
    expect(progressiveProfilingReducer(undefined, {})).toEqual(progressiveProfilingInitialState);
  });

  it('should handle saveUserProfile action', () => {
    const nextState = progressiveProfilingReducer(progressiveProfilingInitialState, saveUserProfile());

    expect(nextState.submitState).toEqual(PENDING_STATE);
  });

  it('should handle saveUserProfileSuccess action', () => {
    const nextState = progressiveProfilingReducer(progressiveProfilingInitialState, saveUserProfileSuccess());

    expect(nextState.submitState).toEqual(COMPLETE_STATE);
  });

  it('should handle saveUserProfileFailure action', () => {
    const nextState = progressiveProfilingReducer(progressiveProfilingInitialState, saveUserProfileFailure());

    expect(nextState.submitState).toEqual(FAILURE_STATE);
  });
});
