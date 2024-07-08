import { logError } from '@edx/frontend-platform/logging';
import { call, put, takeEvery } from 'redux-saga/effects';
import { saveUserProfile, saveUserProfileFailure, saveUserProfileSuccess } from './reducers';
import patchAccount from './services';

/**
 * Saga function for handling save user profile.
 * @param {object} action - The Redux action object containing the payload.
 */
export function* handleSaveUserProfile(action) {
  try {
    yield call(patchAccount, action.payload.username, action.payload.data);
    yield put(saveUserProfileSuccess());
  } catch (e) {
    yield put(saveUserProfileFailure());
    logError(e);
  }
}
export default function* saga() {
  yield takeEvery(saveUserProfile.type, handleSaveUserProfile);
}
//# sourceMappingURL=sagas.js.map