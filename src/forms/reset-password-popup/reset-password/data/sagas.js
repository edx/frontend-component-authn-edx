import { logError, logInfo } from '@edx/frontend-platform/logging';
import { call, put, takeEvery } from 'redux-saga/effects';

import { PASSWORD_RESET, PASSWORD_VALIDATION_ERROR } from './constants';
import {
  resetPassword,
  resetPasswordFailure,
  resetPasswordSuccess,
  validatePassword,
  validatePasswordFailure,
  validatePasswordSuccess,
  validateToken,
  validateTokenFailed,
  validateTokenSuccess,
} from './reducers';
import { resetPasswordRequest, validatePasswordRequest, validateTokenRequest } from './service';
import { setShowPasswordResetBanner } from '../../../login-popup/data/reducers';
import { forgotPasswordTokenInvalidFailure } from '../../forgot-password/data/reducers';

// Services
export function* handleValidateToken(action) {
  try {
    const data = yield call(validateTokenRequest, action.payload);
    const isValid = data.is_valid;

    if (isValid) {
      yield put(validateTokenSuccess(isValid, action.payload));
    } else {
      yield put(validateTokenFailed(PASSWORD_RESET.INVALID_TOKEN));
      yield put(forgotPasswordTokenInvalidFailure(PASSWORD_RESET.INVALID_TOKEN));
    }
  } catch (err) {
    if (err.response && err.response.status === 429) {
      yield put(validateTokenFailed(PASSWORD_RESET.FORBIDDEN_REQUEST));
      yield put(forgotPasswordTokenInvalidFailure(PASSWORD_RESET.FORBIDDEN_REQUEST));
      logInfo(err);
    } else {
      yield put(validateTokenFailed(PASSWORD_RESET.INTERNAL_SERVER_ERROR));
      yield put(forgotPasswordTokenInvalidFailure(PASSWORD_RESET.INTERNAL_SERVER_ERROR));
      logError(err);
    }
  }
}

export function* handleValidatePassword(action) {
  try {
    const data = yield call(validatePasswordRequest, action.payload);
    yield put(validatePasswordSuccess(data));
  } catch (err) {
    yield put(validatePasswordFailure());
    logError(err);
  }
}

export function* handleResetPassword(action) {
  try {
    const data = yield call(
      resetPasswordRequest,
      action.payload.formPayload,
      action.payload.token,
      action.payload.params,
    );
    const resetStatus = data.reset_status;
    const resetErrors = data.err_msg;

    if (resetStatus) {
      yield put(resetPasswordSuccess(resetStatus));
      yield put(setShowPasswordResetBanner());
    } else if (data.token_invalid) {
      yield put(resetPasswordFailure({
        status: PASSWORD_RESET.INVALID_TOKEN,
      }));
      yield put(forgotPasswordTokenInvalidFailure(PASSWORD_RESET.INVALID_TOKEN));
    } else {
      yield put(resetPasswordFailure({
        status: PASSWORD_VALIDATION_ERROR,
        errorMsg: resetErrors,
      }));
    }
  } catch (err) {
    if (err.response && err.response.status === 429) {
      yield put(resetPasswordFailure({
        status: PASSWORD_RESET.FORBIDDEN_REQUEST,
      }));
      logInfo(err);
    } else {
      yield put(resetPasswordFailure({
        status: PASSWORD_RESET.INTERNAL_SERVER_ERROR,
      }));
      logError(err);
    }
  }
}

export default function* saga() {
  yield takeEvery(resetPassword.type, handleResetPassword);
  yield takeEvery(validateToken.type, handleValidateToken);
  yield takeEvery(validatePassword.type, handleValidatePassword);
}
