import { createContext } from 'react';
import { createDispatchHook, createSelectorHook } from 'react-redux';

// Doing this to avoid colliding the component redux store with host MFE's redux store.
// Reference: https://react-redux.js.org/api/hooks#custom-context
export const AuthnContext = /*#__PURE__*/createContext(null);
export const useDispatch = createDispatchHook(AuthnContext);
export const useSelector = createSelectorHook(AuthnContext);
//# sourceMappingURL=storeHooks.js.map