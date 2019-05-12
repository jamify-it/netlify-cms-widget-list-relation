import PropTypes from 'prop-types';
import React from 'react';
import {List} from "immutable";

export default class Preview extends React.Component {
  propTypes = {
    field: PropTypes.any,
    value: PropTypes.any,
  };

  render() {
    const {field, value} = this.props;
    return (<div>
      <strong>{field.get('label')}: </strong>
      {List.isList(value) ? value.toJS().join(', ') : value}
    </div>);
  }
}
