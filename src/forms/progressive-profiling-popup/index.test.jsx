import React from 'react';
import { Provider } from 'react-redux';

import { getConfig, mergeConfig } from '@edx/frontend-platform';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { getLocale, injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import useSubjectList from './data/hooks/useSubjectList';
import { saveUserProfile } from './data/reducers';
import { DEFAULT_STATE } from '../../data/constants';

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
}));
jest.mock('./data/hooks/useSubjectList', () => jest.fn());

describe('ProgressiveProfilingForm Test', () => {
  let store = {};

  const reduxWrapper = children => (
    <IntlProvider locale="en">
      <MemoryRouter>
        <Provider store={store}>{children}</Provider>
      </MemoryRouter>
    </IntlProvider>
  );

  const initialState = {
    progressiveProfiling: {
      submitState: DEFAULT_STATE,
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

  it('should render progressive profiling form', () => {
    render(reduxWrapper(<IntlProgressiveProfilingForm />));

    expect(screen.getByTestId('progressive-profiling-heading')).toBeTruthy();
    expect(screen.getByText('Confirm your country of residence')).toBeTruthy();
    expect(screen.getByText('Personalize your experience')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeTruthy();
  });

  // ******** test progressive profiling form submission ********

  it('should submit form with all form inputs', async () => {
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

  it('should submit form with partial form inputs', async () => {
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

  it('should redirect to dashboard on skip button click', async () => {
    mergeConfig({
      BASE_URL: 'http://localhost:18000',
    });
    delete window.location;
    window.location = {
      assign: jest.fn().mockImplementation((value) => { window.location.href = value; }),
      href: getConfig().BASE_URL,
    };
    const { container } = render(reduxWrapper(<IntlProgressiveProfilingForm />));
    const submitButton = container.querySelector('#skip-optional-fields');

    fireEvent.click(submitButton);
    expect(window.location.href).toEqual(getConfig().BASE_URL);
  });
});
