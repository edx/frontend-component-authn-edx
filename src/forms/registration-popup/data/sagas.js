import { camelCaseObject } from '@edx/frontend-platform';
import { logError, logInfo } from '@edx/frontend-platform/logging';
import { call, put, takeEvery } from 'redux-saga/effects';

import { INTERNAL_SERVER_ERROR } from './constants';
import {
  registerUser, registerUserFailed, registerUserSuccess,
} from './reducers';
import registerRequest from './service';

/**
 * Saga function for handling new user registration.
 * @param {object} action - The Redux action object containing the payload.
 */
export function* handleNewUserRegistration(action) {
  try {
    const {
      authenticatedUser, redirectUrl, success,
    } = yield call(registerRequest, action.payload);

    yield put(registerUserSuccess({
      authenticatedUser: camelCaseObject(authenticatedUser),
      redirectUrl,
      success,
    }));
  } catch (e) {
    const statusCodes = [400, 403, 409];
    if (e.response && statusCodes.includes(e.response.status)) {
      yield put(registerUserFailed(camelCaseObject(e.response.data)));
      logInfo(e);
    } else {
      yield put(registerUserFailed({ errorCode: INTERNAL_SERVER_ERROR }));
      logError(e);
    }
  }
}

/**
 * Root Saga function that listens for REGISTER actions and calls the handleNewUserRegistration saga.
 */
export default function* saga() {
  yield takeEvery(registerUser.type, handleNewUserRegistration);
}
