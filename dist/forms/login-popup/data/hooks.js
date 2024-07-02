import { useEffect, useState } from 'react';

/**
 * A react hook used to detect the account activation param in
 * url and also remove it once its detected.
 * returns account activation param.
 */
const useGetActivationMessage = () => {
  const [activationMessage, setActivationMessage] = useState(null);
  useEffect(() => {
    const url = new URL(window.location.href);
    const accountActivationParam = url.searchParams.get('account_activation_status');
    if (accountActivationParam) {
      setActivationMessage(accountActivationParam);
      url.searchParams.delete('account_activation_status');
      window.history.replaceState(window.history.state, '', url.href);
    }
  }, []);
  return activationMessage;
};
export default useGetActivationMessage;
//# sourceMappingURL=hooks.js.map