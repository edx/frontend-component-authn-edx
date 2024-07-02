import { camelCaseObject } from '@edx/frontend-platform';
import { logError, logInfo } from '@edx/frontend-platform/logging';
import { call, put, takeEvery } from 'redux-saga/effects';
import { loginUser, loginUserFailed, loginUserSuccess } from './reducers';
import loginRequest from './service';
import { FORBIDDEN_REQUEST, INTERNAL_SERVER_ERROR } from '../../../data/constants';

/**
 * Saga function for handling new user login.
 * @param {object} action - The Redux action object containing the payload.
 */
export function* handleUserLogin(action) {
  try {
    const {
      redirectUrl,
      success
    } = yield call(loginRequest, action.payload);
    yield put(loginUserSuccess({
      redirectUrl,
      success
    }));
  } catch (e) {
    const statusCodes = [400];
    if (e.response) {
      const {
        status
      } = e.response;
      if (statusCodes.includes(status)) {
        yield put(loginUserFailed(camelCaseObject(e.response.data)));
        logInfo(e);
      } else if (status === 403) {
        yield put(loginUserFailed({
          errorCode: FORBIDDEN_REQUEST
        }));
        logInfo(e);
      } else {
        yield put(loginUserFailed({
          errorCode: INTERNAL_SERVER_ERROR
        }));
        logError(e);
      }
    }
  }
}

/**
 * Root Saga function that listens for LOGIN actions and calls the handleUserLogin saga.
 */
export default function* saga() {
  yield takeEvery(loginUser.type, handleUserLogin);
}
//# sourceMappingURL=sagas.js.map