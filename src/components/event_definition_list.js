import React, { Component } from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import { Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import store from '../store';
import * as actions from '../actions';
import $ from 'jquery';

class EventDefinitionList extends Component {

  constructor (props) {
    super(props);

    this.scrollToTop = this.scrollToTop.bind(this);
    this.renderEventDefinitions = this.renderEventDefinitions.bind(this);

  }

  componentWillMount() {
    if(this.props.authenticated) {
      this.props.fetchEventDefinitionsForChat();
    }
  }

  // componentDidMount() {
    
  //   this.client.connect((err) => {
  //     let handler = (update, flags) => {
  //       //console.log(update);
  //       store.dispatch(newEventDefinitions(update));
  //     };

  //     this.client.subscribe('/chat/updates', handler, (err) => {
  //       if(err) {
  //         console.log(err);
  //       }
  //     })
  //   })

  // }

  componentDidUpdate() {
    this.scrollToTop();
  }

  scrollToTop() {
    const eventDefinitions = findDOMNode(this.refs.eventDefinitions);
    let desiredHeight = 0;
    $(eventDefinitions).scrollTop(desiredHeight);
  }

  handleEventSubmit(value, text) {

    this.props.createEvent(value, text);
  }

  renderEventDefinitions() {
    if(this.props.event_definitions){
      return this.props.event_definitions.map((event_definition) => {

        return (
          <Link className="btn btn-primary btn-squared" key={event_definition.id} to="#" onClick={ () => this.handleEventSubmit(event_definition.event_value, '') }>{ event_definition.event_value }</Link>
        );
      })      
    }

    return (
      <div>No event definition found</div>
    );
  }

  render() {

    if (!this.props.event_definitions) {
      return (
          <div>Loading...</div>
      )
    }

    if (this.props.event_definitions.length > 0) {
      return (
        <div>{this.renderEventDefinitions()}</div>
      );
    }

    return (
      <Alert bsStyle="danger">No Event Definitions found</Alert>
    );
  }
}

function mapStateToProps(state) {

  return {
    authenticated: state.auth.authenticated,
    event_definitions: state.chat.event_definitions,
  }
}

export default connect(mapStateToProps, actions)(EventDefinitionList);