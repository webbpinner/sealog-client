import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Checkbox, Row, Col, Thumbnail, ControlLabel, Panel, ListGroup, ListGroupItem, FormGroup, FormControl, FormGroupItem, Modal, Well } from 'react-bootstrap';
import { connectModal } from 'redux-modal';
import { LinkContainer } from 'react-router-bootstrap';
import Datetime from 'react-datetime';
import moment from 'moment';

import * as actions from '../actions';

import { API_ROOT_URL, IMAGE_PATH } from '../url_config';

const cookies = new Cookies();

class EventShowDetailsModal extends Component {

  constructor (props) {
    super(props);

    this.state = { event: {} }

  }

  static propTypes = {
    id: PropTypes.string.isRequired,
    handleHide: PropTypes.func.isRequired,
  };

  componentWillMount() {
    axios.get(`${API_ROOT_URL}/api/v1/event_exports/${this.props.id}`,
      {
        headers: {
        authorization: cookies.get('token')
        }
      }      
    )
    .then((response) => {
      // console.log("response:", response.data)
      this.setState({event: response.data})
    })
    .catch((error) => {
      console.log(error);
    });
  }

  componentWillUnmount() {
  }

  renderAuxDataPanel() {

    let return_aux_data = []
    if(this.props.event && this.state.event.aux_data) {
      return this.state.event.aux_data.map((aux_data, index) => {
        let return_data = aux_data.data_array.map((data, index) => {
          return (<div key={`${aux_data.data_source}_data_point_${index}`}><label>{data.data_name}:</label><span> {data.data_value} {data.data_uom}</span></div>)
        })
        return (
          <Col key={`${aux_data.data_source}`} xs={12} md={6}>
            <Panel>
              <label>{aux_data.data_source}:</label>
              <ul>
                {return_data}
                </ul>
            </Panel>
          </Col>
        )
      })
    }  

    return null
  }

  render() {
    const { show, handleHide } = this.props

    let eventOptionsArray = [];

    if(this.state.event.event_options) {

      // console.log("selected event:", this.state.event)
      this.state.event.event_options.map((option) => {
        if (option.event_option_name != 'event_comment') {
          eventOptionsArray.push(option.event_option_name.replace(/\s+/g, "_") + ": \"" + option.event_option_value + "\"");
        }
      })
      
      if (this.state.event.event_free_text) {
        eventOptionsArray.push("text: \"" + this.state.event.event_free_text + "\"")
      } 

      let eventOptions = (eventOptionsArray.length > 0)? '--> ' + eventOptionsArray.join(', '): ''

              // <Row>
                // <Col xs={12}>
                  // {this.renderSciCamPanel()}
                // </Col>
              // </Row>

      return (
        <Modal bsSize="large" show={show} onHide={handleHide}>
            <Modal.Header closeButton>
              <Modal.Title>Event Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                {this.renderAuxDataPanel()}
              </Row>
              <Row>
                <Col xs={12}>
                  {`${this.state.event.ts} <${this.state.event.event_author}>: ${this.state.event.event_value} ${eventOptions}`}
                </Col>
              </Row>
            </Modal.Body>
        </Modal>
      );
    } else {
      return (
        <Modal bsSize="large" show={show} onHide={handleHide}>
          <Modal.Header closeButton>
            <Modal.Title>Event Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Loading...
          </Modal.Body>
        </Modal>
      );
    }
  }
}

function mapStateToProps(state) {

  return {
    roles: state.user.profile.roles,
    event: state.event
  }

}

EventShowDetailsModal = connect(
  mapStateToProps, actions
)(EventShowDetailsModal)

export default connectModal({ name: 'eventShowDetails', destroyOnHide: true })(EventShowDetailsModal)
