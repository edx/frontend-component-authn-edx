import { combineReducers } from 'redux';

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
import commonDataReducer, { commonDataStoreName } from '../onboarding-component/data/reducers';

const createRootReducer = () => combineReducers({
  [registerStoreName]: registerReducer,
  [loginStoreName]: loginReducer,
  [progressiveProfilingStoreName]: progressiveProfilingReducer,
  [commonDataStoreName]: commonDataReducer,
  [forgotPasswordStoreName]: forgotPasswordReducer,
  [resetPasswordStoreName]: resetPasswordReducer,
});

export default createRootReducer;
