import React from 'react';
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

function onFilter(option, column, data) {
  if (option === 'IS_EMPTY') {
    return data.filter(x => x[column] == null); // TODO: check condition
  } else if (option === 'IS_NOT_EMPTY') {
    return data.filter(x => x[column] != null);
  }

  // TODO: finish this
}

export const Filter = (type, column, data, onSubmit) => {
  return (
    <Popover id="filter" title="Filter">
      <FormGroup controlId="formControlsSelect">
        <ControlLabel>Condition</ControlLabel>
        {type !== 'string' &&
          <FormControl componentClass="select" placeholder="select">
            {conditions(type).map(x =>
              <option key={x.id} value={x.id}>{x.name}</option>
            )}
          </FormControl>
        }
      </FormGroup>

      <FormGroup controlId="formBasicText">
        <ControlLabel>Value</ControlLabel>
        <FormControl
          type="text"
          // value={this.state.value}
          placeholder="Value"
          // onChange={this.handleChange}
        />
      </FormGroup>

      <Button type="submit" onClick={() => onSubmit(onFilter('IS_EMPTY', column, data))}>Submit</Button>
    </Popover>);
};

export default Filter;
