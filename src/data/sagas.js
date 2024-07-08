import { all } from 'redux-saga/effects';

import {
  forgotPasswordSaga,
  loginSaga,
  progressiveProfilingSaga,
  registerSaga,
  resetPasswordSaga,
} from '../forms';
import thirdPartyAuthSaga from '../onboarding-component/data/sagas';

export default function* rootSaga() {
  yield all([
    registerSaga(),
    progressiveProfilingSaga(),
    loginSaga(),
    thirdPartyAuthSaga(),
    forgotPasswordSaga(),
    resetPasswordSaga(),
  ]);
}
