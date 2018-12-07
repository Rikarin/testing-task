import React, { Component } from 'react';
import { Table, OverlayTrigger } from 'react-bootstrap';
import { connect } from 'react-redux';
import './App.css';
import * as moment from 'moment';
import { fetchTwitterData } from './reducers';
import Filter from './Filter';

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      sortBy: '',
      sortDirection: false
    };

    this.props.fetchTwitterData();
  }

  clickSort = (column) => {
    var newState = {
      ...this.state
    };

    if (this.state.sortBy === column) {
      newState.sortDirection = !newState.sortDirection;
    } else {
      newState.sortBy = column;
      newState.sortDirection = false;
    }

    this.setState(newState);
  }

  sortByDate = (a, b) => {
    var keyA = moment(a.created_at, 'ddd MMM D HH:mm:ss ZZ YYYY');
    var keyB = moment(b.created_at, 'ddd MMM D HH:mm:ss ZZ YYYY');

    return keyA.diff(keyB) * (this.state.sortDirection ? 1 : -1);
  }

  sortByLikes = (a, b) => {
    return (a.favorite_count - b.favorite_count) * (this.state.sortDirection ? 1 : -1);
  }

  getSortIcon(column) {
    if (this.state.sortBy === column) {
      return this.state.sortDirection ? '^' : 'V';
    }

    return '';
  }

  getSortedData() {
    var data = this.props.twitterData;

    if (this.state.sortBy === 'likes') {
      data = data.sort(this.sortByLikes);
    } else if (this.state.sortBy === 'date') {
      data = data.sort(this.sortByDate);
    }

    return data;
  }

  onFilter = (data) => {

  }

  render() {
    const data = this.getSortedData();

    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th onClick={() => this.clickSort('date')}>Creation Date {this.getSortIcon('date')}</th>
            <th>
              <OverlayTrigger trigger="click" placement="bottom" overlay={Filter(1)}>
                <strong>F </strong>
              </OverlayTrigger>
              Text
            </th>
            <th onClick={() => this.clickSort('likes')}>Likes {this.getSortIcon('likes')}</th>
            <th>Mentions</th>
            <th>Hashtags</th>
          </tr>
        </thead>
        <tbody>
          {data.map((x, i) => {
            return (
              <tr key={i}>
                <td>{moment(x.created_at, 'ddd MMM D HH:mm:ss ZZ YYYY').format('MM/DD/YYYY HH:ss')}</td>
                <td>{x.text}</td>
                <td>{x.favorite_count}</td>
                <td>{(x.text.match(/(^|\s)([@][\w_-]+)/g) || []).length}</td>
                <td>{(x.text.match(/(^|\s)([#][\w_-]+)/g) || []).length}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }
}

const mapStateToProps = state => {
  return { twitterData: state.twitterData };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchTwitterData: () => fetchTwitterData(dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
