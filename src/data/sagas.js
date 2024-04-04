import { all } from 'redux-saga/effects';

import { loginSaga, registerSaga } from '../forms';

export default function* rootSaga() {
  yield all([
    registerSaga(),
    loginSaga(),
  ]);
}
