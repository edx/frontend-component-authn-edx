import React from 'react';
import { Provider } from 'react-redux';

import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { getLocale, injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import useSubjectList from './data/hooks/useSubjectList';
import { saveUserProfile } from './data/reducers';
import { DEFAULT_STATE } from '../../data/constants';
import { AuthnContext } from '../../data/storeHooks';

import ProgressiveProfilingForm from './index';

const IntlProgressiveProfilingForm = injectIntl(ProgressiveProfilingForm);
const mockStore = configureStore();

jest.mock('@edx/frontend-platform/auth', () => ({
  configure: jest.fn(),
  getAuthenticatedUser: jest.fn({}),
}));

getAuthenticatedUser.mockReturnValue({ userId: 3, username: 'abc123', name: 'Test User' });
jest.mock('@edx/frontend-platform/i18n', () => ({
  ...jest.requireActual('@edx/frontend-platform/i18n'),
  getLocale: jest.fn(),
  getMessages: jest.fn(),
}));

jest.mock('./data/hooks/useSubjectList', () => jest.fn());

describe('ProgressiveProfilingForm Test', () => {
  let store = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const reduxWrapper = children => (
    <IntlProvider locale="en">
      <MemoryRouter>
        <Provider context={AuthnContext} store={store}>{children}</Provider>
      </MemoryRouter>
    </IntlProvider>
  );

  const initialState = {
    progressiveProfiling: {
      submitState: DEFAULT_STATE,
    },
    commonData: {
      thirdPartyAuthContext: {
        countryCode: '',
      },
    },
    register: {
      registrationResult: {
        authenticatedUser: {
          userId: 1,
          username: 'abc123',
        },
      },
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
    getLocale.mockImplementationOnce(() => ('en-us'));
    useSubjectList.mockReturnValue({
      subjectsList: {
        options: [
          { label: 'Computer' },
          { label: 'Science' },
        ],
      },
      subjectsLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render progressive profiling form', () => {
    render(reduxWrapper(<IntlProgressiveProfilingForm />));

    expect(screen.getByTestId('progressive-profiling-heading')).toBeTruthy();
    expect(screen.getByText('Confirm your country of residence')).toBeTruthy();
    expect(screen.getByText('Personalize your experience')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeTruthy();
  });

  // ******** test progressive profiling form submission ********

  it('should submit form with all form inputs', () => {
    store.dispatch = jest.fn(store.dispatch);
    const payload = {
      username: 'abc123',
      data: {
        gender: 'm',
        country: 'AF',
        level_of_education: 'none',
        extended_profile: [
          { field_name: 'subject', field_value: 'Computer' },
          { field_name: 'workExperience', field_value: '0yrs' },
          { field_name: 'learningType', field_value: 'Courses' },
        ],
      },
    };

    const { container, getByText } = render(reduxWrapper(<IntlProgressiveProfilingForm />));

    const countryInput = container.querySelector('#country');
    fireEvent.click(countryInput);
    const countryDropdownItem = container.querySelector('.dropdown-item');
    fireEvent.click(countryDropdownItem);

    const subjectInput = container.querySelector('#subject');
    fireEvent.click(subjectInput);
    const subjectDropdownItem = container.querySelector('.dropdown-item');
    fireEvent.click(subjectDropdownItem);

    const levelOfEducationInput = container.querySelector('#levelOfEducation');
    fireEvent.click(levelOfEducationInput);
    const levelOfEducationDropdownItem = container.querySelector('.dropdown-item');
    fireEvent.click(levelOfEducationDropdownItem);

    const workExperienceInput = container.querySelector('#workExperience');
    fireEvent.click(workExperienceInput);
    const workExperienceDropdownItem = container.querySelector('.dropdown-item');
    fireEvent.click(workExperienceDropdownItem);

    const learningTypeInput = container.querySelector('#learningType');
    fireEvent.click(learningTypeInput);
    const learningTypeDropdownItem = container.querySelector('.dropdown-item');
    fireEvent.click(learningTypeDropdownItem);

    const gender = getByText('Male');
    fireEvent.click(gender);

    const submitButton = container.querySelector('#submit-optional-fields');
    fireEvent.click(submitButton);

    expect(store.dispatch).toHaveBeenCalledWith(saveUserProfile(payload));
  });

  it('should submit form with partial form inputs', () => {
    store.dispatch = jest.fn(store.dispatch);
    const payload = {
      username: 'abc123',
      data: {
        gender: 'm',
        country: 'AF',
        level_of_education: 'none',
        extended_profile: [],
      },
    };

    const { container, getByText } = render(reduxWrapper(<IntlProgressiveProfilingForm />));

    const countryInput = container.querySelector('#country');
    fireEvent.click(countryInput);
    const countryDropdownItem = container.querySelector('.dropdown-item');
    fireEvent.click(countryDropdownItem);

    const levelOfEducationInput = container.querySelector('#levelOfEducation');
    fireEvent.click(levelOfEducationInput);
    const levelOfEducationDropdownItem = container.querySelector('.dropdown-item');
    fireEvent.click(levelOfEducationDropdownItem);

    const gender = getByText('Male');
    fireEvent.click(gender);

    const submitButton = container.querySelector('#submit-optional-fields');
    fireEvent.click(submitButton);

    expect(store.dispatch).toHaveBeenCalledWith(saveUserProfile(payload));
  });

  it('should not submit form if country is not selected', () => {
    store.dispatch = jest.fn(store.dispatch);
    const payload = {
      username: 'abc123',
      data: {
        gender: 'm',
        level_of_education: 'none',
        extended_profile: [],
      },
    };

    const { container, getByText } = render(reduxWrapper(<IntlProgressiveProfilingForm />));

    const levelOfEducationInput = container.querySelector('#levelOfEducation');
    fireEvent.click(levelOfEducationInput);
    const levelOfEducationDropdownItem = container.querySelector('.dropdown-item');
    fireEvent.click(levelOfEducationDropdownItem);

    const gender = getByText('Male');
    fireEvent.click(gender);

    const submitButton = container.querySelector('#submit-optional-fields');
    fireEvent.click(submitButton);

    expect(store.dispatch).not.toHaveBeenCalledWith(saveUserProfile(payload));
  });

  it('should clear country field error message on focus event', () => {
    store.dispatch = jest.fn(store.dispatch);
    const payload = {
      username: 'abc123',
      data: {
        gender: 'm',
        level_of_education: 'none',
        extended_profile: [],
      },
    };
    const expectedError = 'Country must match with an option available in the dropdown';

    const { container, getByText } = render(reduxWrapper(<IntlProgressiveProfilingForm />));
    const countryInput = container.querySelector('#country');
    const submitButton = container.querySelector('#submit-optional-fields');
    fireEvent.click(submitButton);

    expect(getByText(expectedError)).toBeTruthy();
    expect(store.dispatch).not.toHaveBeenCalledWith(saveUserProfile(payload));

    fireEvent.focus(countryInput);
    expect(container.querySelector('.pgn__form-text-invalid')).toBeFalsy();
  });

  it('should country field auto populated based store countryCode value', () => {
    store = mockStore({
      ...initialState,
      commonData: {
        thirdPartyAuthContext: {
          countryCode: 'US',
        },
      },
    });
    store.dispatch = jest.fn(store.dispatch);
    const { container } = render(reduxWrapper(<IntlProgressiveProfilingForm />));

    const countryInput = container.querySelector('#country');
    expect(countryInput.value).toEqual('United States of America');
  });

  it('should redirect to redirect url on skip button click', () => {
    store = mockStore({
      ...initialState,
      progressiveProfiling: {
        redirectUrl: 'http://example.com',
      },
    });

    delete window.location;
    window.location = {
      assign: jest.fn().mockImplementation((value) => { window.location.href = value; }),
      href: getConfig().LMS_BASE_URL,
    };
    const { container } = render(reduxWrapper(<IntlProgressiveProfilingForm />));
    const submitButton = container.querySelector('#skip-optional-fields');

    fireEvent.click(submitButton);
    expect(window.location.href).toEqual('http://example.com');
  });
});
