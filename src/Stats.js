import React, { Component } from 'react';
import { Modal, Table, Button } from 'react-bootstrap';
import './App.css';

class Stats extends Component {
  _url = 'https://storage.googleapis.com/goostav-static-files/rh-easy-data-source.json';
  _data = [];

  constructor(props, context) {
    super(props, context);

    this.state = {
      show: true
    };
  }

  componentDidMount() {
    fetch(this._url).then(async x => {
      const data = await x.json();
      this._data = data.slice(-50);
      this.forceUpdate();
    });
  }

  handleClose = () => {
    this.setState({
      show: false
    });
  }

  get allLikes() {
    return this._data.reduce((a, b) => a + b.favorite_count, 0);
  }

  get averageLikes() {
    return this.allLikes / this._data.length;
  }

  get allMentions() {
    const mentions = this._data.map(x => (x.text.match(/(^|\s)([@][\w_-]+)/g) || []));
    var grouped = {};

    mentions.forEach(tweet => {
      tweet.forEach(x => {
        var name = x.trim().toLowerCase();

        if (grouped[name] === undefined) {
          grouped[name] = 0;
        }

        grouped[name]++;
      });
    });

    return grouped;
  }

  render() {
    const mentions = this.allMentions;

    return (
      <Modal show={this.state.show} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Statistics</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>Sum of All Likes</th>
                <th>Average Likes per Tweet</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{this.allLikes}</td>
                <td>{this.averageLikes}</td>
              </tr>
            </tbody>
          </Table>

          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>User</th>
                <th>Mentions</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(mentions).map((key, i) => {
                return (
                  <tr key={i}>
                    <td>{key}</td>
                    <td>{mentions[key]}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default Stats;
