import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { getConfig } from '@edx/frontend-platform';
import { configure as configureLogging } from '@edx/frontend-platform/logging';

class MockLoggingService {
  logInfo = jest.fn();

  logError = jest.fn();
}

export default function initializeMockLogging() {
  const loggingService = configureLogging(MockLoggingService, {
    config: getConfig(),
  });

  return { loggingService };
}
