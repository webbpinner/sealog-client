import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reduxForm, Field, reset } from 'redux-form';
import { FormGroup, Grid, Row, Button, Col, Panel, Alert, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { ROOT_PATH } from '../url_config';
import DeleteEventTemplateModal from './delete_event_template_modal';
import fileDownload from 'react-file-download';
import * as actions from '../actions';

class EventTemplates extends Component {

  componentWillMount() {
      this.props.fetchEventTemplates();
  }

  handleEventTemplateDelete(id) {
    this.props.showModal('deleteEventTemplate', { id: id, handleDelete: this.props.deleteEventTemplate });
  }

  renderAddEventTemplateButton() {
    if (!this.props.showform) {
      return (
        <div className="pull-right">
          <LinkContainer to={`${ROOT_PATH}/event_templates/new`}>
            <Button bsStyle="primary" bsSize="small" type="button">Add Event Template</Button>
          </LinkContainer>
        </div>
      );
    }
  }

  renderEventTemplates() {

    const editTooltip = (<Tooltip id="editTooltip">Edit this template.</Tooltip>)
    const deleteTooltip = (<Tooltip id="deleteTooltip">Delete this template.</Tooltip>)

    return this.props.event_templates.map((template) => {
      //console.log(definition);
      return (
        <tr key={template.id}>
          <td>{template.event_name}</td>
          <td>
            <Link to={`${ROOT_PATH}/event_templates/${template.id}`}><OverlayTrigger placement="top" overlay={editTooltip}><FontAwesome name='pencil' fixedWidth/></OverlayTrigger></Link>&nbsp;
            <Link to="#" onClick={ () => this.handleEventTemplateDelete(template.id) }><OverlayTrigger placement="top" overlay={deleteTooltip}><FontAwesome name='trash' fixedWidth/></OverlayTrigger></Link>
          </td>
        </tr>
      );
    })      
  }

  renderEventTemplatesTable() {
    if(this.props.event_templates.length > 0){
      return (
        <Panel>
          <Table responsive bordered striped fill>
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.renderEventTemplates()}
            </tbody>
          </Table>
        </Panel>
      )
    }
  }

  render() {

    if (!this.props.roles) {
        return (
          <div>Loading...
          </div>
        )
    }

    if (this.props.roles.includes("admin") || this.props.roles.includes("event_manager")) {
      return (
        <Grid fluid>
            <Row>
            <Col sm={6} md={4} lg={4}>
              <DeleteEventTemplateModal />
              {this.renderEventTemplatesTable()}
              {this.renderAddEventTemplateButton()}
            </Col>
          </Row>
        </Grid>
      );

    } else {
      return (
        <div>
          What are YOU doing here?
        </div>
      )
    }
  }
}

function mapStateToProps(state) {
  return {
    event_templates: state.event_template.event_templates,
    roles: state.user.profile.roles
  }
}

export default connect(mapStateToProps, actions)(EventTemplates);