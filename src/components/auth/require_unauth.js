import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export default function(ComposedComponent) {
  class Unauthentication extends Component {
    static contextTypes = {
      router: PropTypes.object
    }

    constructor (props, context) {
      super(props, context);
    }

    componentWillMount() {
      if (this.props.authenticated) {
        this.context.router.history.push(`/`);
      }
    }

    componentWillUpdate(nextProps) {
      if (nextProps.authenticated) {
        this.context.router.history.push(`/`);
      }
    }

    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  function mapStateToProps(state) {
    return { authenticated: state.auth.authenticated };
  }

  return connect(mapStateToProps)(Unauthentication);
}