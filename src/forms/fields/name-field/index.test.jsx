import React from 'react';
import { Provider } from 'react-redux';

import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import { fireEvent, render } from '@testing-library/react';
import configureStore from 'redux-mock-store';

import { OnboardingComponentContext } from '../../../data/storeHooks';
import { clearRegistrationBackendError } from '../../registration-popup/data/reducers';
import { NameField } from '../index';

const IntlNameField = injectIntl(NameField);
const mockStore = configureStore();

describe('NameField', () => {
  let props = {};
  let store = {};

  const reduxWrapper = children => (
    <IntlProvider locale="en">
      <Provider context={OnboardingComponentContext} store={store}>{children}</Provider>
    </IntlProvider>
  );

  const initialState = {
    register: {},
  };

  beforeEach(() => {
    store = mockStore(initialState);
    props = {
      name: 'name',
      value: '',
      errorMessage: '',
      handleChange: jest.fn(),
      handleErrorChange: jest.fn(),
      floatingLabel: '',
      label: '',
    };
    window.location = { search: '' };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Test Name Field', () => {
    const fieldValidation = { name: 'Full name is required' };

    it('should run name field validation when onBlur is fired', () => {
      const { container } = render(reduxWrapper(<IntlNameField {...props} />));

      const nameInput = container.querySelector('input#name');
      fireEvent.blur(nameInput, { target: { value: '', name: 'name' } });

      expect(props.handleErrorChange).toHaveBeenCalledTimes(1);
      expect(props.handleErrorChange).toHaveBeenCalledWith(
        'name',
        fieldValidation.name,
      );
    });

    it('should update errors for frontend validations', () => {
      const { container } = render(reduxWrapper(<IntlNameField {...props} />));

      const nameInput = container.querySelector('input#name');
      fireEvent.blur(nameInput, { target: { value: 'https://invalid-name.com', name: 'name' } });

      expect(props.handleErrorChange).toHaveBeenCalledTimes(1);
      expect(props.handleErrorChange).toHaveBeenCalledWith(
        'name',
        'Enter a valid name',
      );
    });

    it('should clear error on focus', () => {
      const { container } = render(reduxWrapper(<IntlNameField {...props} />));

      const nameInput = container.querySelector('input#name');
      fireEvent.focus(nameInput, { target: { value: '', name: 'name' } });

      expect(props.handleErrorChange).toHaveBeenCalledTimes(1);
      expect(props.handleErrorChange).toHaveBeenCalledWith(
        'name',
        '',
      );
    });

    it('should clear the registration validation error on focus on field', () => {
      const nameError = 'temp error';
      store = mockStore({
        ...initialState,
        register: {
          ...initialState.register,
          registrationError: {
            name: [{ userMessage: nameError }],
          },
        },
      });

      store.dispatch = jest.fn(store.dispatch);
      const { container } = render(reduxWrapper(<IntlNameField {...props} />));

      const nameInput = container.querySelector('input#name');

      fireEvent.focus(nameInput, { target: { value: 'test', name: 'name' } });

      expect(store.dispatch).toHaveBeenCalledWith(clearRegistrationBackendError('name'));
    });
  });
});
