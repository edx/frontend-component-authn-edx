import { createSelector } from 'reselect';

const getProviders = state => state.commonData.thirdPartyAuthContext.providers;

/**
 * Selects and parses the providers list into an object where keys are provider names
 * and values are the provider objects.
 */
const providersSelector = createSelector(
  getProviders,
  providers => providers.reduce(
    (parsedProvidersList, provider) => ({
      ...parsedProvidersList,
      [provider.name]: provider,
    }),
    {},
  ),
);

export default providersSelector;
