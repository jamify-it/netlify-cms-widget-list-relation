import PropTypes from 'prop-types';
import React from 'react';
import {List} from "immutable";

export default function Preview({value, field}) {
  return (
    <div>
      <strong>{field.get('label')}: </strong>
      { List.isList(value) ? value.toJS().join(', ') : value }
    </div>
  );
}

Preview.propTypes = {
  value: PropTypes.node,
};
