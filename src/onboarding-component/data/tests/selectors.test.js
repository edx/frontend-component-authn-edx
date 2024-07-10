import providersSelector from '../selectors';

describe('providersSelector', () => {
  it('should parse the providers list into an object', () => {
    const state = {
      commonData: {
        thirdPartyAuthContext: {
          providers: [
            {
              name: 'Google', id: 1, loginUrl: '/login-url', registerUrl: '/register-url',
            },
            {
              name: 'Facebook', id: 2, loginUrl: '/login-url', registerUrl: '/register-url',
            },
            {
              name: 'Apple', id: 3, loginUrl: '/login-url', registerUrl: '/register-url',
            },
            {
              name: 'Microsoft', id: 4, loginUrl: '/login-url', registerUrl: '/register-url',
            },
          ],
        },
      },
    };

    const result = providersSelector(state);

    expect(result).toEqual({
      Google: {
        name: 'Google', id: 1, loginUrl: '/login-url', registerUrl: '/register-url',
      },
      Facebook: {
        name: 'Facebook', id: 2, loginUrl: '/login-url', registerUrl: '/register-url',
      },
      Apple: {
        name: 'Apple', id: 3, loginUrl: '/login-url', registerUrl: '/register-url',
      },
      Microsoft: {
        name: 'Microsoft', id: 4, loginUrl: '/login-url', registerUrl: '/register-url',
      },
    });
  });

  it('should return an empty object if providers list is empty', () => {
    const state = {
      commonData: {
        thirdPartyAuthContext: {
          providers: [],
        },
      },
    };

    const result = providersSelector(state);

    expect(result).toEqual({});
  });
});
