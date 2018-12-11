import React, { Component } from 'react';
import { Table, OverlayTrigger } from 'react-bootstrap';
import { connect } from 'react-redux';
import './App.css';
import * as moment from 'moment';
import { fetchTwitterData } from './reducers';
import Filter, { filterData } from './Filter';

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      sortBy: '',
      sortDirection: false,
      filters: []
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
    return moment(a.created_at).diff(moment(b.created_at)) * (this.state.sortDirection ? 1 : -1);
  }

  sortByLikes = (a, b) => {
    return (a.likes - b.likes) * (this.state.sortDirection ? 1 : -1);
  }

  getSortIcon(column) {
    if (this.state.sortBy === column) {
      return this.state.sortDirection ? '^' : 'V';
    }

    return '';
  }

  sortData(data) {
    if (this.state.sortBy === 'likes') {
      data = data.sort(this.sortByLikes);
    } else if (this.state.sortBy === 'created_at') {
      data = data.sort(this.sortByDate);
    }

    return data;
  }

  setFilter = (column, cond, value) => {
    var filters = this.state.filters;

    if (cond === null) {
      delete filters[column];
    } else {
      filters[column] = {
        cond,
        value
      };
    }

    this.setState({
      ...this.state,
      filters: filters
    });
  }

  render() {
    var data = this.props.twitterData.map(x => {
      return {
        created_at: moment(x.created_at, 'ddd MMM D HH:mm:ss ZZ YYYY').format('MM/DD/YYYY HH:ss'),
        text: x.text,
        likes: x.favorite_count,
        mentions: (x.text.match(/(^|\s)([@][\w_-]+)/g) || []).length,
        hashtags: (x.text.match(/(^|\s)([#][\w_-]+)/g) || []).length,
      };
    });

    data = filterData(this.sortData(data), this.state.filters);

    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th onClick={() => this.clickSort('created_at')}>S {this.getSortIcon('created_at')} Creation Date</th>
            <th>
              <OverlayTrigger trigger="click" placement="bottom" overlay={Filter(1, (cond, value) => this.setFilter('text', cond, value))}>
                <strong>F </strong>
              </OverlayTrigger>
              Text
            </th>
            <th>
              <OverlayTrigger trigger="click" placement="bottom" overlay={Filter(2, (cond, value) => this.setFilter('likes', cond, value))}>
                <strong>F </strong>
              </OverlayTrigger>
              <div onClick={() => this.clickSort('likes')}>S {this.getSortIcon('likes')}</div>
              Likes
            </th>
            <th>
              <OverlayTrigger trigger="click" placement="bottom" overlay={Filter(2, (cond, value) => this.setFilter('likes', cond, value))}>
                <strong>F </strong>
              </OverlayTrigger>
              Mentions
            </th>
            <th>Hashtags</th>
          </tr>
        </thead>
        <tbody>
          {data.map((x, i) => {
            return (
              <tr key={i}>
                <td>{x.created_at}</td>
                <td>{x.text}</td>
                <td>{x.likes}</td>
                <td>{x.mentions}</td>
                <td>{x.hashtags}</td>
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
