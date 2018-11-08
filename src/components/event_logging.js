import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import EventTemplateList from './event_template_list';
import EventHistory from './event_history';
import EventInput from './event_input';
import EventCommentModal from './event_comment_modal';
import { Panel, Grid, Row, Col } from 'react-bootstrap';
import EventShowDetailsModal from './event_show_details_modal';

import * as actions from '../actions';

class EventLogging extends Component {

  constructor (props) {
    super(props);

  }

  render() {
    return (
      <div>
        <EventCommentModal />
        <EventShowDetailsModal />
        <Row>
          <Col>
            <EventTemplateList />
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <EventInput />
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <EventHistory />
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps, actions)(EventLogging);