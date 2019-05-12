import PropTypes from 'prop-types';
import React from 'react';
import {List} from "immutable";

const Preview = ({field, value}) => {
  return <div>
      <strong>{field.get('label')}: </strong>
      {List.isList(value) ? value.toJS().join(', ') : value}
    </div>;
};

Preview.propTypes = {
  field: PropTypes.any,
  value: PropTypes.any
}

export default Preview;
