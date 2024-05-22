import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  progressiveProfilingFormHeading: {
    id: 'progressive.profiling.form.heading',
    defaultMessage: 'Fill out your profile',
    description: 'Heading for the form that appears after a user registers with edX',
  },
  progressiveProfilingCompletionSkipMessage: {
    id: 'progressive.profiling.completion.skip.message',
    defaultMessage: 'If you skip now, you can complete your profile under "Account settings" at any time.',
    description: 'Message that appears on the user profile completion form',
  },
  progressiveProfilingCountryFieldTitle: {
    id: 'progressive.profiling.country.field.title',
    defaultMessage: 'Confirm your country of residence',
    description: 'Title for the country field',
  },
  progressiveProfilingCountryFieldInfoMessage: {
    id: 'progressive.profiling.country.field.info.message',
    defaultMessage: 'We have determined your country of residence. If this is incorrect, please edit your country.',
    description: 'Informative message for the auto-populated country field',
  },
  useProfileCountryFieldUndetected: {
    id: 'progressive.profiling.country.field.undetected',
    defaultMessage: 'Undetected',
    description: 'Placeholder text for country field when we are not able to auto-detect the country',
  },
  progressiveProfilingCountryFieldHelpText: {
    id: 'progressive.profiling.country.field.help.text',
    defaultMessage: 'Your country of residence determines availability of certain courses',
    description: 'Help text for country field',
  },
  progressiveProfilingDataCollectionTitle: {
    id: 'progressive.profiling.data.collection.title',
    defaultMessage: 'Personalize your experience',
    description: 'Title that appears above optional demographic fields',
  },
  progressiveProfilingSubjectFieldLabel: {
    id: 'progressive.profiling.subject.field.label',
    defaultMessage: 'What field are you interested in?',
    description: '"Subject" field label',
  },
  progressiveProfilingSubjectFieldPlaceholder: {
    id: 'progressive.profiling.subject.field.placeholder',
    defaultMessage: 'Select a field',
    description: '"Subject" field placeholder text',
  },
  progressiveProfilingLevelOfEducationFieldLabel: {
    id: 'progressive.profiling.level.of.education.field.label',
    defaultMessage: 'What is the highest level of education you have completed?',
    description: '"Level of Education" field label',
  },
  progressiveProfilingLevelOfEducationFieldPlaceholder: {
    id: 'progressive.profiling.level.of.education.field.placeholder',
    defaultMessage: 'Select a level',
    description: '"Level of Education" field placeholder text',
  },
  progressiveProfilingWorkExperienceFieldLabel: {
    id: 'progressive.profiling.work.experience.field.label',
    defaultMessage: 'How many years of work experience do you have?',
    description: '"Work Experience" field label',
  },
  progressiveProfilingWorkExperienceFieldPlaceholder: {
    id: 'progressive.profiling.work.experience.field.placeholder',
    defaultMessage: 'Select an option',
    description: '"Work Experience" field placeholder text',
  },
  progressiveProfilingLearningTypeFieldLabel: {
    id: 'progressive.profiling.learning.type.field.label',
    defaultMessage: 'What type of experience are you interested in?',
    description: '"Learning Type" field label',
  },
  progressiveProfilingLearningTypeFieldPlaceholder: {
    id: 'progressive.profiling.learning.type.field.placeholder',
    defaultMessage: 'Select a product',
    description: '"Learning Type" field placeholder text',
  },
  progressiveProfilingGenderFieldLabel: {
    id: 'progressive.profiling.gender.field.label',
    defaultMessage: 'What is your gender?',
    description: '"Gender" field label',
  },
  progressiveProfilingGenderFieldPlaceholder: {
    id: 'progressive.profiling.gender.field.placeholder',
    defaultMessage: 'Select an option',
    description: '"Gender" field placeholder text',
  },
  progressiveProfilingSkipForNowButtonText: {
    id: 'progressive.profiling.skip.for.now.button.text',
    defaultMessage: 'Skip for now',
    description: 'Text that appears on the button that skips the optional profile data form',
  },
  progressiveProfilingSubmitButtonText: {
    id: 'progressive.profiling.submit.button.text',
    defaultMessage: 'Submit',
    description: 'Text that appears on the button that submits the optional profile data form',
  },
  // Subject Options
  'subject.option.Business & Management': {
    id: 'subject.option.Business & Management',
    defaultMessage: 'Business & Management',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.Computer Science': {
    id: 'subject.option.Computer Science',
    defaultMessage: 'Computer Science',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.Engineering': {
    id: 'subject.option.Engineering',
    defaultMessage: 'Engineering',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.Social Sciences': {
    id: 'subject.option.Social Sciences',
    defaultMessage: 'Social Sciences',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.Data Analysis & Statistics': {
    id: 'subject.option.Data Analysis & Statistics',
    defaultMessage: 'Data Analysis & Statistics',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.Economics & Finance': {
    id: 'subject.option.Economics & Finance',
    defaultMessage: 'Economics & Finance',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.Communication': {
    id: 'subject.option.Communication',
    defaultMessage: 'Communication',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.Humanities': {
    id: 'subject.option.Humanities',
    defaultMessage: 'Humanities',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.Science': {
    id: 'subject.option.Science',
    defaultMessage: 'Science',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.Environmental Studies': {
    id: 'subject.option.Environmental Studies',
    defaultMessage: 'Environmental Studies',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.Medicine': {
    id: 'subject.option.Medicine',
    defaultMessage: 'Medicine',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.Biology & Life Sciences': {
    id: 'subject.option.Biology & Life Sciences',
    defaultMessage: 'Biology & Life Sciences',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.Health & Safety': {
    id: 'subject.option.Health & Safety',
    defaultMessage: 'Health & Safety',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.Education & Teacher Training': {
    id: 'subject.option.Education & Teacher Training',
    defaultMessage: 'Education & Teacher Training',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.Art & Culture': {
    id: 'subject.option.Art & Culture',
    defaultMessage: 'Art & Culture',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.Math': {
    id: 'subject.option.Math',
    defaultMessage: 'Math',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.History': {
    id: 'subject.option.History',
    defaultMessage: 'History',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.Design': {
    id: 'subject.option.Design',
    defaultMessage: 'Design',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.Physics': {
    id: 'subject.option.Physics',
    defaultMessage: 'Physics',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.Energy & Earth Sciences': {
    id: 'subject.option.Energy & Earth Sciences',
    defaultMessage: 'Energy & Earth Sciences',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.Law': {
    id: 'subject.option.Law',
    defaultMessage: 'Law',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.Philosophy & Ethics': {
    id: 'subject.option.Philosophy & Ethics',
    defaultMessage: 'Philosophy & Ethics',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.Language': {
    id: 'subject.option.Language',
    defaultMessage: 'Language',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.Electronics': {
    id: 'subject.option.Electronics',
    defaultMessage: 'Electronics',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.Food & Nutrition': {
    id: 'subject.option.Food & Nutrition',
    defaultMessage: 'Food & Nutrition',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.Architecture': {
    id: 'subject.option.Architecture',
    defaultMessage: 'Architecture',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.Chemistry': {
    id: 'subject.option.Chemistry',
    defaultMessage: 'Chemistry',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.Literature': {
    id: 'subject.option.Literature',
    defaultMessage: 'Literature',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.Ethics': {
    id: 'subject.option.Ethics',
    defaultMessage: 'Ethics',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.Music': {
    id: 'subject.option.Music',
    defaultMessage: 'Music',
    description: 'Option for the subject dropdown field',
  },
  'subject.option.Philanthropy': {
    id: 'subject.option.Philanthropy',
    defaultMessage: 'Philanthropy',
    description: 'Option for the subject dropdown field',
  },
  // Level of Education Options
  'levelOfEducation.option.none': {
    id: 'levelOfEducation.option.none',
    defaultMessage: 'No formal education',
    description: 'Option for education level field',
  },
  'levelOfEducation.option.jhs': {
    id: 'levelOfEducation.option.jhs',
    defaultMessage: 'Junior secondary/junior high/middle school',
    description: 'Option for education level field',
  },
  'levelOfEducation.option.hs': {
    id: 'levelOfEducation.option.hs',
    defaultMessage: 'Secondary/High School',
    description: 'Option for education level field',
  },
  'levelOfEducation.option.a': {
    id: 'levelOfEducation.option.a',
    defaultMessage: 'Associate Degree',
    description: 'Option for education level field',
  },
  'levelOfEducation.option.b': {
    id: 'levelOfEducation.option.b',
    defaultMessage: 'Bachelor\'s Degree',
    description: 'Option for education level field',
  },
  'levelOfEducation.option.m': {
    id: 'levelOfEducation.option.m',
    defaultMessage: 'Master\'s or professional degree',
    description: 'Option for education level field',
  },
  'levelOfEducation.option.p': {
    id: 'levelOfEducation.option.p',
    defaultMessage: 'Doctorate',
    description: 'Option for education level field',
  },
  'levelOfEducation.option.other': {
    id: 'levelOfEducation.option.other',
    defaultMessage: 'Other',
    description: 'Option for education level field',
  },
  // Work Experience Options
  'workExperience.option.0yrs': {
    id: 'workExperience.option.0yrs',
    defaultMessage: 'I don’t have any work experience',
    description: 'Option for work experience field',
  },
  'workExperience.option.1-5yrs': {
    id: 'workExperience.option.1-5yrs',
    defaultMessage: 'I have 1-5 years of work experience',
    description: 'Option for work experience field',
  },
  'workExperience.option.6-10yrs': {
    id: 'workExperience.option.6-10yrs',
    defaultMessage: 'I have 6-10 years of work experience',
    description: 'Option for work experience field',
  },
  'workExperience.option.11-15yrs': {
    id: 'workExperience.option.11-15yrs',
    defaultMessage: 'I have 11-15 years of work experience',
    description: 'Option for work experience field',
  },
  'workExperience.option.16-20yrs': {
    id: 'workExperience.option.16-20yrs',
    defaultMessage: 'I have 16-20 years of work experience',
    description: 'Option for work experience field',
  },
  'workExperience.option.20+yrs': {
    id: 'workExperience.option.20+yrs',
    defaultMessage: 'More than 20 years of work experience',
    description: 'Option for work experience field',
  },
  // Learning Experience Options
  'learningType.option.Courses': {
    id: 'learningType.option.Courses',
    defaultMessage: 'Courses',
    description: 'Option for learning type dropdown field',
  },
  'learningType.option.Programs': {
    id: 'learningType.option.Programs',
    defaultMessage: 'Programs',
    description: 'Option for learning type dropdown field',
  },
  'learningType.option.Boot Camps': {
    id: 'learningType.option.Boot Camps',
    defaultMessage: 'Boot Camps',
    description: 'Option for learning type dropdown field',
  },
  'learningType.option.Degrees': {
    id: 'learningType.option.Degree Programs',
    defaultMessage: 'Degrees',
    description: 'Option for learning type dropdown field',
  },
  'learningType.option.Executive Education': {
    id: 'learningType.option.Executive Education',
    defaultMessage: 'Executive Education',
    description: 'Option for learning type dropdown field',
  },
  'learningType.option.unsure': {
    id: 'learningType.option.Unsure',
    defaultMessage: 'Unsure',
    description: 'Option for learning type dropdown field',
  },
  // Gender Options
  'gender.option.m': {
    id: 'gender.option.m',
    defaultMessage: 'Male',
    description: 'Option for gender field',
  },
  'gender.option.f': {
    id: 'gender.option.f',
    defaultMessage: 'Female',
    description: 'Option for gender field',
  },
  'gender.option.o': {
    id: 'gender.option.o',
    defaultMessage: 'Other/prefer not to answer',
    description: 'Option for gender field',
  },
});

export default messages;
