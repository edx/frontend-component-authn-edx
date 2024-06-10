import { getConfig } from '@edx/frontend-platform';
import PropTypes from 'prop-types';

import { setCurrentOpenedForm } from '../../authn-component/data/reducers';
import { PROGRESSIVE_PROFILING_FORM } from '../../data/constants';
import { useDispatch } from '../../data/storeHooks';
import {
  setProgressiveProfilingRedirectUrl,
} from '../progressive-profiling-popup/data/reducers';

/**
 * Component that handles redirection after successful authentication.
 *
 * Redirections:
 * - Redirects to progressive profiling form if redirectToProgressiveProfilingForm is true.
 * - Redirects to the finishAuthUrl if provided and not already included in redirectUrl,
 * otherwise redirects to the specified redirectUrl.
 *
 * @param {string} finishAuthUrl - The URL to complete the authentication pipeline.
 * @param {string} redirectUrl - The URL to redirect to after authentication.
 * @param {boolean} redirectToProgressiveProfilingForm - Flag indicating if to redirect to progressive profiling.
 * @param {boolean} success - Flag indicating if authentication was successful.
 *
 * @returns {null} This component does not render anything, it handles redirects.
 */
const AuthenticatedRedirection = ({
  finishAuthUrl = null,
  redirectUrl = '',
  redirectToProgressiveProfilingForm = false,
  success = false,
}) => {
  const dispatch = useDispatch();

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

    // Redirect to Progressive Profiling after successful registration
    if (redirectToProgressiveProfilingForm) {
      dispatch(setProgressiveProfilingRedirectUrl(finalRedirectUrl));
      dispatch(setCurrentOpenedForm(PROGRESSIVE_PROFILING_FORM));
      return null;
    }

    window.location.href = finalRedirectUrl;
  }

  return null;
};

AuthenticatedRedirection.propTypes = {
  finishAuthUrl: PropTypes.string,
  success: PropTypes.bool,
  redirectUrl: PropTypes.string,
  redirectToProgressiveProfilingForm: PropTypes.bool,
};

export default AuthenticatedRedirection;
