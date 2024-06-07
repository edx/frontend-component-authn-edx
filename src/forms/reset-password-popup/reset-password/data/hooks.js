import { useEffect, useState } from 'react';

/**
 * A react hook used to detect the authMode param in
 * url and also remove it once its detected.
 * returns authMode param.
 */
const useGetAuthModeParam = () => {
  const [activationMessage, setActivationMessage] = useState(null);

  useEffect(() => {
    const url = new URL(window.location.href);

    const authModeParam = url.searchParams.get('authMode');
    if (authModeParam) {
      setActivationMessage(authModeParam);
      url.searchParams.delete('authMode');
      window.history.replaceState(window.history.state, '', url.href);
    }
  }, []);

  return activationMessage;
};

export default useGetAuthModeParam;
