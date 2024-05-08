import { getConfig } from '@edx/frontend-platform';
import PropTypes from 'prop-types';

/**
 * Component that handles redirection after successful authentication.
 * Redirects to the finishAuthUrl if provided and not already included in redirectUrl,
 * otherwise redirects to the specified redirectUrl.
 *
 * @param {string} finishAuthUrl - The URL to complete the authentication pipeline.
 * @param {string} redirectUrl - The URL to redirect to after authentication.
 * @param {boolean} success - Flag indicating if authentication was successful.
 *
 * @returns {null} This component does not render anything, it handles redirects.
 */
const AuthenticatedRedirection = ({
  finishAuthUrl,
  redirectUrl,
  success,
}) => {
  if (success) {
    let finalRedirectUrl = '';
    // If we're in a third party auth pipeline, we must complete the pipeline
    // once user has successfully logged in. Otherwise, redirect to the specified redirect url.
    // Note: For multiple enterprise use case, we need to make sure that user first visits the
    // enterprise selection page and then complete the auth workflow
    if (finishAuthUrl && !redirectUrl.includes(finishAuthUrl)) {
      finalRedirectUrl = getConfig().LMS_BASE_URL + finishAuthUrl;
    } else {
      finalRedirectUrl = redirectUrl;
    }

    window.location.href = finalRedirectUrl;
  }

  return null;
};

AuthenticatedRedirection.defaultProps = {
  finishAuthUrl: null,
  success: false,
  redirectUrl: '',
};

AuthenticatedRedirection.propTypes = {
  finishAuthUrl: PropTypes.string,
  success: PropTypes.bool,
  redirectUrl: PropTypes.string,
};

export default AuthenticatedRedirection;
