import { combineReducers } from 'redux';

import {
  loginReducer,
  loginStoreName,
  registerReducer,
  registerStoreName,
} from '../forms';

const createRootReducer = () => combineReducers({
  [registerStoreName]: registerReducer,
  [loginStoreName]: loginReducer,
});

export default createRootReducer;
