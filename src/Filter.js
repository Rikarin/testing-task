import React, { Component } from 'react';
import { Popover, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import './App.css';

// type: 0 - all, 1 - string, 2 - numeric
const _conditions = [
  {
    id: 'IS_EMPTY',
    name: 'Is Empty',
    hasValue: false,
    type: 0
  },
  {
    id: 'IS_NOT_EMPTY',
    name: 'Is Not Empty',
    hasValue: false,
    type: 0
  },
  {
    id: 'IS_EQUAL',
    name: 'Is Equal',
    hasValue: true,
    type: 0
  },
  {
    id: 'IS_NOT_EQUAL',
    name: 'Is Not Equal',
    hasValue: true,
    type: 0
  },

  {
    id: 'BEGINS_WITH',
    name: 'Begins With',
    hasValue: true,
    type: 1
  },
  {
    id: 'ENDS_WITH',
    name: 'Ends With',
    hasValue: true,
    type: 1
  },
  {
    id: 'CONTAINS',
    name: 'Contains',
    hasValue: true,
    type: 1
  },
  {
    id: 'DOES_NOT_CONTAINS',
    name: 'Does Not Contains',
    hasValue: true,
    type: 1
  },
  {
    id: 'HAS_LENGTH',
    name: 'Has Length',
    hasValue: true,
    type: 1
  },

  {
    id: 'IS_GREATHER',
    name: 'Is Greather',
    hasValue: true,
    type: 2
  },
  {
    id: 'IS_GREATHER_OR_EQUAL',
    name: 'Is Greather or Equal',
    hasValue: true,
    type: 2
  },
  {
    id: 'IS_LESS',
    name: 'Is Less',
    hasValue: true,
    type: 2
  },
  {
    id: 'IS_LESS_OR_EQUAL',
    name: 'Is Less or Equal',
    hasValue: true,
    type: 2
  }
];

function conditions(type) {
  const general = _conditions.filter(x => x.type === 0);
  const specific = _conditions.filter(x => x.type === type);

  return [
    ...general,
    ...specific
  ];
};

export function filterData(data, filters) {
  Object.keys(filters).forEach(filter => {
    const value = filters[filter].value;

    switch (filters[filter].cond) {
      case 'IS_EMPTY':
        data = data.filter(x => x[filter] == null); // TODO: check condition
        break;

      case 'IS_NOT_EMPTY':
        data = data.filter(x => x[filter] != null);
        break;

      case 'IS_EQUAL':
        data = data.filter(x => x[filter] === value);
        break;

      case 'IS_NOT_EQUAL':
        data = data.filter(x => x[filter] !== value);
        break;

      case 'BEGINS_WITH':
        data = data.filter(x => x[filter].startsWith(value));
        break;

      case 'ENDS_WITH':
        data = data.filter(x => x[filter].endsWith(value));
        break;

      case 'CONTAINS':
        data = data.filter(x => x[filter].includes(value));
        break;

      case 'HAS_LEGTH':
        data = data.filter(x => x[filter].length === value);
        break;

      case 'DOES_NOT_CONTAINS':
        data = data.filter(x => !x[filter].includes(value));
        break;

      case 'IS_GREATHER':
        data = data.filter(x => x[filter] > value);
        break;

      case 'IS_GREATHER_OR_EQUAL':
        data = data.filter(x => x[filter] >= value);
        break;

      case 'IS_LESS':
        data = data.filter(x => x[filter] < value);
        break;

      case 'IS_LESS_OR_EQUAL':
        data = data.filter(x => x[filter] <= value);
        break;

      default:
    }
  });

  return data;
}

export const Filter = (type, onSubmit) => {
  return (
    <Popover id="filter" title="Filter">
      <FilterInner type={type} onSubmit={onSubmit}></FilterInner>
    </Popover>);
};

export default Filter;



class FilterInner extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      value: '',
      condition: 'IS_EMPTY'
    };
  }

  handleChangeCondition = (e) => {
    this.setState({
      ...this.state,
      condition: e.target.value
    });
  }

  handleChangeValue = (e) => {
    this.setState({
      ...this.state,
      value: e.target.value
    });
  }

  reset = () => {
    this.setState({
      value: '',
      condition: 'IS_EMPTY'
    });

    this.props.onSubmit(null, null);
  }

  render() {
    return (
      <div>
        <FormGroup controlId="formControlsSelect">
          <ControlLabel>Condition</ControlLabel>
          {this.props.type !== 'string' &&
            <FormControl
              componentClass="select"
              placeholder="select"
              value={this.state.condition}
              onChange={this.handleChangeCondition}
            >
              {conditions(this.props.type).map(x =>
                <option key={x.id} value={x.id}>{x.name}</option>
              )}
            </FormControl>
          }
        </FormGroup>

        <FormGroup controlId="formBasicText">
          <ControlLabel>Value</ControlLabel>
          <FormControl
            type="text"
            value={this.state.value}
            placeholder="Value"
            onChange={this.handleChangeValue}
          />
        </FormGroup>

        <Button type="submit" onClick={() => this.props.onSubmit(this.state.condition, this.state.value)}>Submit</Button>
        <Button type="submit" onClick={this.reset}>Reset</Button>
      </div>
    );
  }
}