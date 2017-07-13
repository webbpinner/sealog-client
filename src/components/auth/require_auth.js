import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actions from '../../actions';
import { ROOT_PATH } from '../../url_config';

export default function(ComposedComponent) {
  class Authentication extends Component {
    static contextTypes = {
      router: PropTypes.object
    }

    constructor (props, context) {
      super(props, context);
    }

    componentWillMount() {
      this.props.validateJWT();
      if (!this.props.authenticated) {
        this.context.router.history.push(`${ROOT_PATH}/login`);
      }
    }

    componentWillUpdate(nextProps) {
      this.props.validateJWT();
      if (!nextProps.authenticated) {
        this.context.router.history.push(`${ROOT_PATH}/login`);
      }
    }

    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  function mapStateToProps(state) {
    return { authenticated: state.auth.authenticated };
  }

  return connect(mapStateToProps, actions)(Authentication);
}