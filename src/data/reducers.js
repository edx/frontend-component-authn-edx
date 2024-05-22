import { combineReducers } from 'redux';

import commonDataReducer, { commonDataStoreName } from '../authn-component/data/reducers';
import {
  forgotPasswordReducer,
  forgotPasswordStoreName,
  loginReducer,
  loginStoreName,
  registerReducer,
  registerStoreName,
} from '../forms';

const createRootReducer = () => combineReducers({
  [registerStoreName]: registerReducer,
  [loginStoreName]: loginReducer,
  [commonDataStoreName]: commonDataReducer,
  [forgotPasswordStoreName]: forgotPasswordReducer,
});

export default createRootReducer;
