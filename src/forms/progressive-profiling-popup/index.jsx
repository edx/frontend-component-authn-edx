import React, { useMemo } from 'react';

import { getCountryList, getLocale, useIntl } from '@edx/frontend-platform/i18n';
import {
  Button, Container, Form, Icon,
} from '@openedx/paragon';
import { Language } from '@openedx/paragon/icons';

import './index.scss';
import { optionalFieldsData } from './data/constants';
import messages from './messages';

/**
 * Progressive profiling form component. This component holds the logic to render optional demographic
 * form fields and infor users about the auto-generated country field.
 *
 * @returns {JSX.Element} Progressive profiling form rendered inside BaseContainer component.
 */
const ProgressiveProfilingForm = () => {
  const { formatMessage } = useIntl();
  const countryList = useMemo(() => getCountryList(getLocale()), []);

  const getFieldOptions = (fieldName, fieldData) => fieldData.options.map(option => (
    // The subject list is generated dynamically from the Algolia index. There is a chance
    // that new subjects are added to the index for which the translation is not available.
    // The check below ensure that in such cases, untranslated label is shown in the dropdown list
    <Form.AutosuggestOption id={option.label}>
      {
        messages[`${fieldName}.option.${option.label}`]
          ? formatMessage(messages[`${fieldName}.option.${option.label}`])
          : option.label
      }
    </Form.AutosuggestOption>
  ));

  const getCountryFieldOptions = () => countryList.map((country) => (
    <Form.AutosuggestOption key={country.code}>
      {country.name}
    </Form.AutosuggestOption>
  ));

  return (
    <Container size="lg" className="authn__popup-progressive-profiling-container m-0 overflow-auto">
      <h1
        className="display-1 font-italic text-center mb-4"
        data-testid="progressive-profiling-heading"
      >
        {formatMessage(messages.progressiveProfilingFormHeading)}
      </h1>
      <p className="text-center">
        {formatMessage(messages.progressiveProfilingCompletionSkipMessage)}
      </p>
      <hr className="heading-separator mb-3 mt-3" />
      <Form id="progressive-profiling" name="progressive-profiling">
        <h3 className="mb-2.5 mt-2">
          {formatMessage(messages.progressiveProfilingCountryFieldTitle)}
        </h3>
        <p className="x-small">
          {formatMessage(messages.progressiveProfilingCountryFieldInfoMessage)}
        </p>
        <Form.Group controlId="country" className="mb-4.5">
          <Form.Autosuggest
            name="country"
            placeholder={formatMessage(messages.useProfileCountryFieldUndetected)}
            leadingElement={<Icon src={Language} />}
          >
            {getCountryFieldOptions()}
          </Form.Autosuggest>
          <Form.Control.Feedback>
            {formatMessage(messages.progressiveProfilingCountryFieldHelpText)}
          </Form.Control.Feedback>
        </Form.Group>
        <h3 className="mb-2.5">
          {formatMessage(messages.progressiveProfilingDataCollectionTitle)}
        </h3>
        <Form.Group controlId="subject" className="mb-4">
          <Form.Label>
            {formatMessage(messages.progressiveProfilingSubjectFieldLabel)}
          </Form.Label>
          <Form.Autosuggest
            name="subject"
            placeholder={formatMessage(messages.progressiveProfilingSubjectFieldPlaceholder)}
          >
            {getFieldOptions('subject', optionalFieldsData.subject)}
          </Form.Autosuggest>
        </Form.Group>
        <Form.Group controlId="level-of-education" className="mb-4">
          <Form.Label>
            {formatMessage(messages.progressiveProfilingLevelOfEducationFieldLabel)}
          </Form.Label>
          <Form.Autosuggest
            name="level-of-education"
            placeholder={formatMessage(messages.progressiveProfilingLevelOfEducationFieldPlaceholder)}
          >
            {getFieldOptions('levelOfEducation', optionalFieldsData.levelOfEducation)}
          </Form.Autosuggest>
        </Form.Group>
        <Form.Group controlId="work-experience" className="mb-4">
          <Form.Label>
            {formatMessage(messages.progressiveProfilingWorkExperienceFieldLabel)}
          </Form.Label>
          <Form.Autosuggest
            name="work-experience"
            placeholder={formatMessage(messages.progressiveProfilingWorkExperienceFieldPlaceholder)}
          >
            {getFieldOptions('workExperience', optionalFieldsData.workExperience)}
          </Form.Autosuggest>
        </Form.Group>
        <Form.Group controlId="learning-type" className="mb-4">
          <Form.Label>
            {formatMessage(messages.progressiveProfilingLearningTypeFieldLabel)}
          </Form.Label>
          <Form.Autosuggest
            name="learning-type"
            placeholder={formatMessage(messages.progressiveProfilingLearningTypeFieldPlaceholder)}
          >
            {getFieldOptions('learningType', optionalFieldsData.learningType)}
          </Form.Autosuggest>
        </Form.Group>
        <Form.Group controlId="gender" className="mb-4">
          <Form.Label>
            {formatMessage(messages.progressiveProfilingGenderFieldLabel)}
          </Form.Label>
          <Form.RadioSet
            name="gender"
            onChange={() => {}}
            isInline
          >
            {optionalFieldsData.gender.options.map(option => (
              <Form.Radio value={option.label}>
                {formatMessage(messages[`gender.option.${option.label}`])}
              </Form.Radio>
            ))}
          </Form.RadioSet>
        </Form.Group>
        <div className="d-flex my-4 justify-content-end progressive-profiling__cta-btn-container">
          <Button
            id="skip-optional-fields"
            name="skip-optional-fields"
            type="submit"
            variant="outline-dark"
            onClick={() => {}}
            onMouseDown={(e) => e.preventDefault()}
          >
            {formatMessage(messages.progressiveProfilingSkipForNowButtonText)}
          </Button>
          <Button
            id="submit-optional-fields"
            name="submit-optional-fields"
            type="submit"
            onClick={() => {}}
            onMouseDown={(e) => e.preventDefault()}
          >
            {formatMessage(messages.progressiveProfilingSubmitButtonText)}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default ProgressiveProfilingForm;
