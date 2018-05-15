import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import EventDefinistionList from './event_definition_list';
import ChatHistory from './chat_history';
import ChatInput from './chat_input';
import { Panel, Grid, Row, Col } from 'react-bootstrap';

import * as actions from '../actions';

class Chat extends Component {

  constructor (props) {
    super(props);

  }

  render() {
    return (
      <Grid fluid>
        <Row>
          <Col>
            <EventDefinistionList />
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <ChatInput />
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <ChatHistory />
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

export default connect(mapStateToProps, actions)(Chat);