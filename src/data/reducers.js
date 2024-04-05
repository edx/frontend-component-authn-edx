import { combineReducers } from 'redux';

import { registerReducer, registerStoreName } from '../forms';

const createRootReducer = () => combineReducers({
  [registerStoreName]: registerReducer,
});

export default createRootReducer;
