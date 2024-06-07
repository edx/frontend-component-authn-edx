import { combineReducers } from 'redux';

import commonDataReducer, { commonDataStoreName } from '../authn-component/data/reducers';
import {
  forgotPasswordReducer,
  forgotPasswordStoreName,
  loginReducer,
  loginStoreName,
  progressiveProfilingReducer,
  progressiveProfilingStoreName,
  registerReducer,
  registerStoreName,
  resetPasswordReducer,
  resetPasswordStoreName,
} from '../forms';

const createRootReducer = () => combineReducers({
  [registerStoreName]: registerReducer,
  [loginStoreName]: loginReducer,
  [progressiveProfilingStoreName]: progressiveProfilingReducer,
  [commonDataStoreName]: commonDataReducer,
  [forgotPasswordStoreName]: forgotPasswordReducer,
  [resetPasswordStoreName]: resetPasswordReducer,
});

export default createRootReducer;
