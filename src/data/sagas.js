import { all } from 'redux-saga/effects';

import thirdPartyAuthSaga from '../authn-component/data/sagas';
import { forgotPasswordSaga, loginSaga, registerSaga } from '../forms';

export default function* rootSaga() {
  yield all([
    registerSaga(),
    loginSaga(),
    thirdPartyAuthSaga(),
    forgotPasswordSaga(),
  ]);
}
