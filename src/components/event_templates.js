import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reduxForm, Field, reset } from 'redux-form';
import { FormGroup, Grid, Row, Button, Col, Panel, Alert, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { ROOT_PATH } from '../url_config';
import CreateEventTemplate from './create_event_template';
import UpdateEventTemplate from './update_event_template';
import DeleteEventTemplateModal from './delete_event_template_modal';
import * as actions from '../actions';

let fileDownload = require('js-file-download');

class EventTemplates extends Component {

  constructor (props) {
    super(props);

  }

  componentWillMount() {
      this.props.fetchEventTemplates();
  }

  handleEventTemplateDelete(id) {
    this.props.showModal('deleteEventTemplate', { id: id, handleDelete: this.props.deleteEventTemplate });
  }

  handleEventTemplateSelect(id) {
    // console.log("Set Event Template:", id)
    this.props.initEventTemplate(id);
  }

  handleEventTemplateCreate() {
    // console.log("Clear");
    this.props.leaveUpdateEventTemplateForm()
  }

  exportTemplatesToJSON() {
    fileDownload(JSON.stringify(this.props.event_templates, null, 2), 'sealog_eventTemplateExport.json');
  }

  renderAddEventTemplateButton() {
    if (!this.props.showform && this.props.roles && (this.props.roles.includes('admin') || this.props.roles.includes('event_manager'))) {
      return (
        <div className="pull-right">
          <Button bsStyle="primary" bsSize="small" type="button" onClick={ () => this.handleEventTemplateCreate()}>Add Event Template</Button>
        </div>
      );
    }
  }

  renderEventTemplates() {

    const editTooltip = (<Tooltip id="editTooltip">Edit this template.</Tooltip>)
    const deleteTooltip = (<Tooltip id="deleteTooltip">Delete this template.</Tooltip>)

    if(this.props.event_templates && this.props.event_templates.length > 0) {
      return this.props.event_templates.map((template) => {
        //console.log(definition);
        return (
          <tr key={template.id}>
            <td>{template.event_name}</td>
            <td>{template.event_value}</td>
            <td>
              <Link to="#" onClick={ () => this.handleEventTemplateSelect(template.id) }><OverlayTrigger placement="top" overlay={editTooltip}><FontAwesome name='pencil' fixedWidth/></OverlayTrigger></Link>&nbsp;
              <Link to="#" onClick={ () => this.handleEventTemplateDelete(template.id) }><OverlayTrigger placement="top" overlay={deleteTooltip}><FontAwesome name='trash' fixedWidth/></OverlayTrigger></Link>
            </td>
          </tr>
        );
      })
    }

    return (
      <tr key="noEventTemplatesFound">
        <td colSpan="3"> No event templates found!</td>
      </tr>
    )   
  }

  renderEventTemplatesTable() {
    if(this.props.event_templates.length > 0){
      return (
        <Panel>
          <Table responsive bordered striped fill>
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
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

  renderEventTemplatesHeader() {

    const Label = "Event Templates"

    // const importTooltip = (<Tooltip id="importTooltip">Import Event Templates</Tooltip>)
    const exportTooltip = (<Tooltip id="exportTooltip">Export Event Templates</Tooltip>)

    // <Button bsStyle="default" bsSize="xs" type="button" onClick={ this.handleImportEventTemplateList }><OverlayTrigger placement="top" overlay={importTooltip}><FontAwesome name='upload' fixedWidth/></OverlayTrigger></Button>

    return (
      <div>
        { Label }
        <div className="pull-right">
          <Button bsStyle="default" bsSize="xs" type="button" onClick={ () => this.exportTemplatesToJSON() }><OverlayTrigger placement="top" overlay={exportTooltip}><FontAwesome name='download' fixedWidth/></OverlayTrigger></Button>
        </div>
      </div>
    );
  }

  render() {

    if (!this.props.roles) {
        return (
          <div>Loading...
          </div>
        )
    }

    if (this.props.roles.includes("admin") || this.props.roles.includes("event_manager")) {

      let eventTemplatesForm = (this.props.event_templateid)? <UpdateEventTemplate /> : <CreateEventTemplate />

      return (
        <Grid fluid>
          <DeleteEventTemplateModal />
          <Row>
            <Col sm={8} md={6} lgOffset= {1} lg={5}>
              <Panel header={this.renderEventTemplatesHeader()}>
                {this.renderEventTemplatesTable()}
              </Panel>
              {this.renderAddEventTemplateButton()}
            </Col>
            <Col sm={8} md={6} lg={5}>
              { eventTemplatesForm }
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
    event_templateid: state.event_template.event_template.id,
    roles: state.user.profile.roles
  }
}

export default connect(mapStateToProps, actions)(EventTemplates);