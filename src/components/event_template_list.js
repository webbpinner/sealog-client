import React, { Component } from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import { Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import EventTemplateOptionsModal from './event_template_options_modal';
import store from '../store';
import * as actions from '../actions';
// import $ from 'jquery';

class EventTemplateList extends Component {

  constructor (props) {
    super(props);

    // this.scrollToTop = this.scrollToTop.bind(this);
    this.renderEventTemplates = this.renderEventTemplates.bind(this);

  }

  componentWillMount() {
    if(this.props.authenticated) {
      this.props.fetchEventTemplatesForMain();
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
    // this.scrollToTop();
  }

  // scrollToTop() {
  //   const eventTemplates = findDOMNode(this.refs.eventTemplates);
  //   let desiredHeight = 0;
  //   $(eventTemplates).scrollTop(desiredHeight);
  // }

  handleEventSubmit(event_template) {

    if( event_template.event_options.length > 0 || event_template.event_free_text_required ) {
      this.props.showModal('eventOptions', { eventTemplate: event_template, handleCreateEvent: this.props.createEvent });
    } else {
      // console.log(event_template.event_value);
      this.props.createEvent(event_template.event_value, '', []);
    }
  }

  renderEventTemplates() {
    if(this.props.event_templates){
      return this.props.event_templates.map((event_template) => {

        return (
          <Link className="btn btn-primary btn-squared" key={event_template.id} to="#" onClick={ () => this.handleEventSubmit(event_template) }>{ event_template.event_name }</Link>
        );
      })      
    }

    return (
      <div>No event template found</div>
    );
  }

  render() {

    if (!this.props.event_templates) {
      return (
          <div>Loading...</div>
      )
    }

    if (this.props.event_templates.length > 0) {
      return (
        <div>
          <EventTemplateOptionsModal/>
          {this.renderEventTemplates()}
        </div>
      );
    }

    return (
      <Alert bsStyle="danger">No Event Templates found</Alert>
    );
  }
}

function mapStateToProps(state) {

  return {
    authenticated: state.auth.authenticated,
    event_templates: state.event_history.event_templates,
  }
}

export default connect(mapStateToProps, actions)(EventTemplateList);