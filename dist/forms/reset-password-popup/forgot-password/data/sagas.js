import { logError, logInfo } from '@edx/frontend-platform/logging';
import { call, put, takeEvery } from 'redux-saga/effects';
import { forgotPassword, forgotPasswordFailed, forgotPasswordForbidden, forgotPasswordSuccess } from './reducers';
import forgotPasswordService from './service';

/**
 * Saga function for handling forgot password actions.
 * @param {object} action - The Redux action object containing the payload.
 */
export function* handleForgotPassword(action) {
  try {
    yield call(forgotPasswordService, action.payload);
    yield put(forgotPasswordSuccess(action.payload));
  } catch (e) {
    if (e.response && e.response.status === 403) {
      yield put(forgotPasswordForbidden());
      logInfo(e);
    } else {
      yield put(forgotPasswordFailed());
      logError(e);
    }
  }
}
export default function* saga() {
  yield takeEvery(forgotPassword.type, handleForgotPassword);
}
//# sourceMappingURL=sagas.js.map