import React from 'react';
import PropTypes from 'prop-types';

const SuggestionItem = (props) => (
  <div>{props.suggestion}</div>
);

SuggestionItem.propTypes = {
  suggestion: PropTypes.string.isRequired,
};

export default SuggestionItem;
