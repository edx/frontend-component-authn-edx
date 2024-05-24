import { useEffect, useState } from 'react';

import { getConfig } from '@edx/frontend-platform';
import algoliasearch from 'algoliasearch';
import algoliasearchHelper from 'algoliasearch-helper';

import { defaultSubjectList } from '../constants';

const PRODUCT_INDEX = 'product';
const SUBJECT_FACET = 'subject';

const getAlgoliaSearchClient = () => algoliasearch(
  getConfig().AUTHN_ALGOLIA_APP_ID,
  getConfig().AUTHN_ALGOLIA_SEARCH_API_KEY,
);

const parseSubjectsFromAlgoliaResults = (subjectsList) => (
  subjectsList.map(subject => ({ label: subject.name }))
);

const useSubjectsList = () => {
  const [subjectsList, setSubjectsList] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);

  useEffect(() => {
    const searchClient = getAlgoliaSearchClient();
    const searchHelper = algoliasearchHelper(
      searchClient,
      PRODUCT_INDEX,
      { facets: [SUBJECT_FACET] },
    );

    const searchIndex = () => {
      setSubjectsLoading(true);
      searchHelper.search();
    };

    searchIndex();

    searchHelper.on('result', ({ results }) => {
      setSubjectsList(parseSubjectsFromAlgoliaResults(results.getFacetValues(SUBJECT_FACET, {})));
      setSubjectsLoading(false);
    });

    searchHelper.on('error', () => {
      setSubjectsLoading(false);
      setSubjectsList(parseSubjectsFromAlgoliaResults(defaultSubjectList));
    });
  }, []);

  return {
    subjectsList: {
      options: subjectsList,
    },
    subjectsLoading,
  };
};

export default useSubjectsList;
