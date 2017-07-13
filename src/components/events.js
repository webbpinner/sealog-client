import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import EventList from './event_list';
import EventFilterForm from './event_filter_form';
import { Panel, Grid, Row, Col } from 'react-bootstrap';

import * as actions from '../actions';

class Events extends Component {

  constructor (props) {
    super(props);

  }

  render() {
    return (
      <Grid fluid>
        <Row>
          <Col sm={6} md={5} lg={4}>
            <EventFilterForm />
          </Col>
          <Col sm={6} md={7} lg={6}>
            <EventList />
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

export default connect(mapStateToProps, actions)(Events);