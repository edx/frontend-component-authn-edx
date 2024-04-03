import { all } from 'redux-saga/effects';

import { registerSaga } from '../forms';

export default function* rootSaga() {
  yield all([
    registerSaga(),
  ]);
}
