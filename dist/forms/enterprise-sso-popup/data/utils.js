// Utility functions
import QueryString from 'query-string';
export const getTpaProvider = (tpaHintProvider, primaryProviders, secondaryProviders) => {
  let tpaProvider = null;
  if (!tpaHintProvider) {
    return {
      provider: tpaProvider
    };
  }
  [...primaryProviders, ...secondaryProviders].forEach(provider => {
    if (provider.id === tpaHintProvider) {
      tpaProvider = provider;
    }
  });
  return {
    provider: tpaProvider
  };
};
export const getTpaHint = () => {
  const params = QueryString.parse(window.location.search);
  let tpaHint = params.tpa_hint;
  if (!tpaHint) {
    const {
      next
    } = params;
    if (next) {
      const index = next.indexOf('tpa_hint=');
      if (index !== -1) {
        tpaHint = next.substring(index + 'tpa_hint='.length, next.length);
      }
    }
  }
  return tpaHint;
};
//# sourceMappingURL=utils.js.map