import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import './App.css';
import * as moment from 'moment';
import { fetchTwitterData } from './reducers';

class App extends Component {
  _url = 'https://storage.googleapis.com/goostav-static-files/rh-easy-data-source.json';
  _data = [];

  constructor(props, context) {
    super(props, context);

    this.state = {
      sortDate: false,
      sortLikes: false
    };

    this.props.fetchTwitterData();
  }

  clickSort = (column) => {
    var newState = {
      ...this.state
    };

    newState[column] = !this.state[column];
    this.setState(newState);
  }

  sortByDates = (a, b) => {
    var keyA = moment(a.created_at, 'ddd MMM D HH:mm:ss ZZ YYYY');
    var keyB = moment(b.created_at, 'ddd MMM D HH:mm:ss ZZ YYYY');

    return keyA.diff(keyB) * (this.state.sortDate ? 1 : -1);
  }

  sortByLikes = (a, b) => {
    return (a - b) * (this.state.sortLikes ? 1 : -1);
  }

  render() {
    var data = this.props.twitterData.sort(this.sortByDates);

    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th onClick={() => this.clickSort('sortDate')}>Creation Date { this.state.sortDate ? '^' : 'V' }</th>
            <th>Text</th>
            <th onClick={() => this.clickSort('sortLikes')}>Likes { this.state.sortLikes ? '^' : 'V' }</th>
            <th>Mentions</th>
            <th>Hashtags</th>
          </tr>
        </thead>
        <tbody>
          {data.map((x, i) => {
            return (
              <tr key={i}>
                <td>{ moment(x.created_at, 'ddd MMM D HH:mm:ss ZZ YYYY').format('MM/DD/YYYY HH:ss') }</td>
                <td>{ x.text }</td>
                <td>{ x.favorite_count }</td>
                <td>{ (x.text.match(/(^|\s)([@][\w_-]+)/g) || []).length }</td>
                <td>{ (x.text.match(/(^|\s)([#][\w_-]+)/g) || []).length }</td>
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
