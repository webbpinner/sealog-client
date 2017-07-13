import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import * as actions from '../../actions';

class Logout extends Component {
  componentWillMount() {
    this.props.logout();
  }

  render() {
    return (
      <div />
    );
  }
}

export default connect(null, actions)(Logout);
