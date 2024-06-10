import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { getConfig } from '@edx/frontend-platform';
import { configure as configureLogging } from '@edx/frontend-platform/logging';

class MockLoggingService {
  logInfo = jest.fn();

  logError = jest.fn();
}
jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackEvent: jest.fn(),
  sendPageEvent: jest.fn(),
}));

export default function initializeMockLogging() {
  const loggingService = configureLogging(MockLoggingService, {
    config: getConfig(),
  });

  return { loggingService };
}

const location = new URL('https://authn.edx.org');
location.assign = jest.fn();
location.replace = jest.fn();
location.reload = jest.fn();
delete window.location;
window.location = location;
