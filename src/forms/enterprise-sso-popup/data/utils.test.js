import QueryString from 'query-string';

import { getTpaHint, getTpaProvider } from './utils';

// Mocking the query-string library
jest.mock('query-string');

describe('Utility Functions', () => {
  describe('getTpaProvider', () => {
    it('should return the provider from primaryProviders', () => {
      const tpaHintProvider = 'google-oauth2';
      const primaryProviders = [{ id: 'google-oauth2' }, { id: 'facebook' }];
      const secondaryProviders = [{ id: 'twitter' }];

      const result = getTpaProvider(tpaHintProvider, primaryProviders, secondaryProviders);
      expect(result.provider).toEqual({ id: 'google-oauth2' });
    });

    it('should return the provider from secondaryProviders', () => {
      const tpaHintProvider = 'twitter';
      const primaryProviders = [{ id: 'google-oauth2' }, { id: 'facebook' }];
      const secondaryProviders = [{ id: 'twitter' }];

      const result = getTpaProvider(tpaHintProvider, primaryProviders, secondaryProviders);
      expect(result.provider).toEqual({ id: 'twitter' });
    });

    it('should return null if provider is not found', () => {
      const tpaHintProvider = 'linkedin';
      const primaryProviders = [{ id: 'google-oauth2' }, { id: 'facebook' }];
      const secondaryProviders = [{ id: 'twitter' }];

      const result = getTpaProvider(tpaHintProvider, primaryProviders, secondaryProviders);
      expect(result.provider).toBeNull();
    });

    it('should return null if tpaHintProvider is not provided', () => {
      const tpaHintProvider = null;
      const primaryProviders = [{ id: 'google-oauth2' }, { id: 'facebook' }];
      const secondaryProviders = [{ id: 'twitter' }];

      const result = getTpaProvider(tpaHintProvider, primaryProviders, secondaryProviders);
      expect(result.provider).toBeNull();
    });
  });

  describe('getTpaHint', () => {
    it('should return tpa_hint from the query string', () => {
      QueryString.parse.mockReturnValue({ tpa_hint: 'google-oauth2' });

      const result = getTpaHint();
      expect(result).toBe('google-oauth2');
    });

    it('should return tpa_hint from the "next" parameter in the query string', () => {
      QueryString.parse.mockReturnValue({ next: 'some-path?tpa_hint=facebook' });

      const result = getTpaHint();
      expect(result).toBe('facebook');
    });

    it('should return undefined if tpa_hint is not found', () => {
      QueryString.parse.mockReturnValue({ next: 'some-path' });

      const result = getTpaHint();
      expect(result).toBeUndefined();
    });
  });
});
