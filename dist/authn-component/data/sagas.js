import { logError } from '@edx/frontend-platform/logging';
import { call, put, takeEvery } from 'redux-saga/effects';
import { getThirdPartyAuthContext, getThirdPartyAuthContextFailed, getThirdPartyAuthContextSuccess } from './reducers';
import fetchThirdPartyAuthContext from './service';

/**
 * Saga function for fetching third party auth context data.
 */
export function* fetchThirdPartyAuthContextSaga(action) {
  try {
    const {
      thirdPartyAuthContext
    } = yield call(fetchThirdPartyAuthContext, action.payload);
    yield put(getThirdPartyAuthContextSuccess(thirdPartyAuthContext));
  } catch (e) {
    yield put(getThirdPartyAuthContextFailed());
    logError(e);
  }
}

/**
 * Root Saga function that listens for TPA actions and calls the fetchThirdPartyAuthContext saga.
 */
export default function* saga() {
  yield takeEvery(getThirdPartyAuthContext.type, fetchThirdPartyAuthContextSaga);
}
//# sourceMappingURL=sagas.js.map