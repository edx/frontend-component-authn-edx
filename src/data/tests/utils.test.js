import { getConfig, mergeConfig } from '@edx/frontend-platform';
import Cookies from 'universal-cookie';

import getAllPossibleQueryParams, { getCountryCookieValue } from '../utils';

describe('getAllPossibleQueryParams', () => {
  beforeEach(() => {
    // Mock the window location search
    delete global.window.location;
    global.window.location = { search: '' };
  });

  it('should return an empty object when no valid params are present', () => {
    const queryParams = getAllPossibleQueryParams();
    expect(queryParams).toEqual({});
  });

  it('should return only valid params when valid and invalid params are present', () => {
    global.window.location.search = '?course_id=value1&invalidParam=invalidValue&next=value2';
    const queryParams = getAllPossibleQueryParams();
    expect(queryParams).toEqual({ course_id: 'value1', next: 'value2' });
  });

  it('should parse query parameters from a provided URL string', () => {
    const url = 'http://example.com?course_id=value1&invalidParam=invalidValue&next=value2';
    const queryParams = getAllPossibleQueryParams(url);
    expect(queryParams).toEqual({ course_id: 'value1', next: 'value2' });
  });
});

describe('getCountryCookieValue', () => {
  // Mock Cookies
  jest.mock('universal-cookie');

  mergeConfig({ ONBOARDING_COMPONENT_ENV: 'development' });

  it('should return cookie value', () => {
    const cookie = new Cookies();
    cookie.set(`${getConfig().ONBOARDING_COMPONENT_ENV}-edx-cf-loc`, 'US');
    const countryCode = getCountryCookieValue();
    expect(countryCode).toEqual('US');
  });

  it('should return undefined cookie value', () => {
    const cookie = new Cookies();
    cookie.remove(`${getConfig().ONBOARDING_COMPONENT_ENV}-edx-cf-loc`);

    const countryCode = getCountryCookieValue();
    expect(countryCode).toEqual(undefined);
  });
});
