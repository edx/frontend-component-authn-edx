export { default as RegistrationForm } from './registration-popup';
export { default as registerReducer } from './registration-popup/data/reducers';
export { default as registerSaga } from './registration-popup/data/sagas';
export { storeName as registerStoreName } from './registration-popup/data/reducers';

export { default as LoginForm } from './login-popup';
export { default as loginReducer } from './login-popup/data/reducers';
export { default as loginSaga } from './login-popup/data/sagas';
export { storeName as loginStoreName } from './login-popup/data/reducers';

export { default as ForgotPasswordForm } from './reset-password-popup/forgot-password';
export { default as forgotPasswordReducer } from './reset-password-popup/forgot-password/data/reducers';
export { default as forgotPasswordSaga } from './reset-password-popup/forgot-password/data/sagas';
export { storeName as forgotPasswordStoreName } from './reset-password-popup/forgot-password/data/reducers';
