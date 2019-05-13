import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import AsyncSelect from "react-select/lib/Async";
import {find, isEmpty, last} from "lodash";
import {List, Map, fromJS} from "immutable";
import {reactSelectStyles} from "netlify-cms-ui-default";

function optionToString(option) {
  return option && option.value ? option.value : "";
}

function convertToOption(raw) {
  if (typeof raw === "string") {
    return {label: raw, value: raw};
  }
  return Map.isMap(raw) ? raw.toJS() : raw;
}

function getSelectedValue({value, options, isMultiple}) {
  if (isMultiple) {
    const selectedOptions = List.isList(value) ? value.toJS() : value;

    if (!selectedOptions || !Array.isArray(selectedOptions)) {
      return null;
    }

    return selectedOptions
      .map((i) => find(options, (o) => o.value === (i.value || i)))
      .filter(Boolean);
  } else {
    return find(options, ["value", value]) || null;
  }
}

class Control extends React.Component {
  shouldComponentUpdate(nextProps) {
    return (
      this.props.value !== nextProps.value ||
      this.props.hasActiveStyle !== nextProps.hasActiveStyle
    );
  }

  handleChange(selectedOption) {
    const {onChange, field} = this.props;
    const displayField = field.get('displayField', 'name');
    let value;
    let metadata;

    if (Array.isArray(selectedOption)) {
      value = selectedOption.map(optionToString);
      metadata =
        (!isEmpty(selectedOption) && {
          [field.get("name")]: {
            [field.get("collection").get('name')]: {
              [last(value)]: last(selectedOption).data,
            },
          },
        }) ||
        {};
      onChange(fromJS(value), metadata);
    } else {
      value = optionToString(selectedOption);
      metadata = selectedOption && {
        [field.get("name")]: {
          [field.get("collection").get('name')]: {[value]: selectedOption.data},
        },
      };
      onChange(value[displayField], metadata);
    }
  }

  parseHitOptions(hits) {
    const {field} = this.props;
    const valueField = field.get("valueField");
    const displayField = field.get("displayField") || field.get("valueField");

    return hits.map((hit) => {
      return {
        data: hit,
        value: hit[valueField],
        label: List.isList(displayField)
          ? displayField
            .toJS()
            .map((key) => hit[key])
            .join(" ")
          : hit[displayField],
      };
    });
  }

  processOptions(term, field, options, callback) {
    if (term) {
      const searchFields = field.get("searchFields");
      const searchFieldsArray = List.isList(searchFields) ? searchFields.toJS() : [searchFields];

      options = options.filter((hit) => {
        for (const field of searchFieldsArray) {
          if (hit[field] && hit[field].toLowerCase().includes(term.toLowerCase())) {
            return true;
          }
        }

        return false;
      });

    } else {
      if (!this.allOptions) {
        this.allOptions = options;
        this.forceUpdate();
      }

      options = options.slice(0, 20);
    }

    callback(options);
  }

  loadOptions(term, callback) {
    const {loadEntry, field} = this.props;

    try {
      const collection = field.get("collection");

      if (this.allOptions) {
        this.processOptions(term, field, this.allOptions, callback);
      } else {
        loadEntry(collection.get("name"), collection.get("file"))
          .then((result) => {
            const options = this.parseHitOptions(result.payload.entry.data[collection.get("field")].map(convertToOption));
            this.processOptions(term, field, options, callback);
          });
      }
    } catch (err) {
      console.error("FileRelationWidget error", err);
    }
  }

  render() {
    const {
      value,
      field,
      forID,
      classNameWrapper,
      setActiveStyle,
      setInactiveStyle,
    } = this.props;
    const isMultiple = field.get("multiple", false);
    const isClearable = !field.get("required", true) || isMultiple;

    const options = this.allOptions;
    const selectedValue = getSelectedValue({
      options,
      value,
      isMultiple,
    });

    return (
      <AsyncSelect
        value={selectedValue}
        inputId={forID}
        defaultOptions
        loadOptions={this.loadOptions.bind(this)}
        onChange={this.handleChange}
        className={classNameWrapper}
        onFocus={setActiveStyle}
        onBlur={setInactiveStyle}
        styles={reactSelectStyles}
        isMulti={isMultiple}
        isClearable={isClearable}
        placeholder=""
      />
    );
  }
}

Control.propTypes = {
  onChange: PropTypes.func.isRequired,
  forID: PropTypes.string.isRequired,
  value: PropTypes.node,
  field: ImmutablePropTypes.map,
  fetchID: PropTypes.string,
  classNameWrapper: PropTypes.string.isRequired,
  setActiveStyle: PropTypes.func.isRequired,
  setInactiveStyle: PropTypes.func.isRequired,
};

export default Control;
