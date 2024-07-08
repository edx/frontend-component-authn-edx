import { camelCaseObject } from '@edx/frontend-platform';
import { logError, logInfo } from '@edx/frontend-platform/logging';
import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchRealtimeValidations, fetchRealtimeValidationsFailed, fetchRealtimeValidationsSuccess, registerUser, registerUserFailed, registerUserSuccess } from './reducers';
import registerRequest, { getFieldsValidations } from './service';
import { INTERNAL_SERVER_ERROR } from '../../../data/constants';

/**
 * Saga function for handling new user registration.
 * @param {object} action - The Redux action object containing the payload.
 */
export function* handleNewUserRegistration(action) {
  try {
    const {
      authenticatedUser,
      redirectUrl,
      success
    } = yield call(registerRequest, action.payload);
    yield put(registerUserSuccess({
      authenticatedUser: camelCaseObject(authenticatedUser),
      redirectUrl,
      success
    }));
  } catch (e) {
    const statusCodes = [400, 403, 409];
    if (e.response && statusCodes.includes(e.response.status)) {
      yield put(registerUserFailed(camelCaseObject(e.response.data)));
      logInfo(e);
    } else {
      yield put(registerUserFailed({
        errorCode: INTERNAL_SERVER_ERROR
      }));
      logError(e);
    }
  }
}

/**
 * Saga function for handling new validations.
 * @param {object} action - The Redux action object containing the payload.
 */
export function* fetchValidationsSaga(action) {
  try {
    const {
      fieldValidations
    } = yield call(getFieldsValidations, action.payload);
    yield put(fetchRealtimeValidationsSuccess(camelCaseObject(fieldValidations)));
  } catch (e) {
    if (e.response && e.response.status === 403) {
      yield put(fetchRealtimeValidationsFailed());
      logInfo(e);
    } else {
      logError(e);
    }
  }
}

/**
 * Root Saga function that listens for REGISTER actions and calls the handleNewUserRegistration saga
 * and fetchValidationsSaga.
 */
export default function* saga() {
  yield takeEvery(registerUser.type, handleNewUserRegistration);
  yield takeEvery(fetchRealtimeValidations.type, fetchValidationsSaga);
}
//# sourceMappingURL=sagas.js.map