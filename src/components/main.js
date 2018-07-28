import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import EventTemplateList from './event_template_list';
import EventHistory from './event_history';
import EventInput from './event_input';
import EventCommentModal from './event_comment_modal';
import { Panel, Grid, Row, Col } from 'react-bootstrap';

import * as actions from '../actions';

class Main extends Component {

  constructor (props) {
    super(props);

  }

  render() {
    return (
      <Grid fluid>
        <EventCommentModal />
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
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps, actions)(Main);