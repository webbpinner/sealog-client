import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reduxForm, Field, reset } from 'redux-form';
import { FormGroup, Grid, Row, Button, Col, Panel, Alert, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { ROOT_PATH } from '../url_config';
import CreateEventTemplate from './create_event_template';
import UpdateEventTemplate from './update_event_template';
import NonSystemEventTemplatesWipeModal from './non_system_event_templates_wipe_modal';
import DeleteEventTemplateModal from './delete_event_template_modal';
import ImportEventTemplatesModal from './import_event_templates_modal';
import * as actions from '../actions';

let fileDownload = require('js-file-download');

class EventTemplates extends Component {

  constructor (props) {
    super(props);

    this.handleEventTemplateImportClose = this.handleEventTemplateImportClose.bind(this);
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

  handleEventTemplateImport() {
    this.props.showModal('importEventTemplates');
  }

  handleEventTemplateImportClose() {
    this.props.fetchEventTemplates();
  }

  handleNonSystemEventTemplatesWipe() {
    this.props.showModal('nonSystemEventTemplatesWipe', { handleDelete: this.props.deleteAllNonSystemEventTemplates });
  }

  exportTemplatesToJSON() {
    fileDownload(JSON.stringify(this.props.event_templates.filter(template => template.system_template == false), null, 2), 'sealog_eventTemplateExport.json');
  }

  exportSystemTemplatesToJSON() {
    fileDownload(JSON.stringify(this.props.event_templates.filter(template => template.system_template == true), null, 2), 'sealog_systemEventTemplateExport.json');
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

  renderImportEventTemplatesButton() {
    if(this.props.roles.includes("admin")) {
      return (
        <div className="pull-right">
          <Button bsStyle="primary" bsSize="small" type="button" onClick={ () => this.handleEventTemplateImport()}>Import From File</Button>
        </div>
      );
    }
  }


  renderEventTemplates() {

    const editTooltip = (<Tooltip id="editTooltip">Edit this template.</Tooltip>)
    const deleteTooltip = (<Tooltip id="deleteTooltip">Delete this template.</Tooltip>)

    return this.props.event_templates.filter(template => template.system_template == false).map((template) => {
      return (
        <tr key={template.id}>
          <td>{template.event_name}</td>
          <td>{template.event_value}</td>
          <td>
            <Link to="#" onClick={ () => this.handleEventTemplateSelect(template.id) }><OverlayTrigger placement="top" overlay={editTooltip}><FontAwesomeIcon icon='pencil-alt' fixedWidth/></OverlayTrigger></Link>{' '}
            <Link to="#" onClick={ () => this.handleEventTemplateDelete(template.id) }><OverlayTrigger placement="top" overlay={deleteTooltip}><FontAwesomeIcon icon='trash' fixedWidth/></OverlayTrigger></Link>
          </td>
        </tr>
      );
    })
  }

  renderSystemEventTemplates() {

    const editTooltip = (<Tooltip id="editTooltip">Edit this template.</Tooltip>)
    const deleteTooltip = (<Tooltip id="deleteTooltip">Delete this template.</Tooltip>)

    if(this.props.event_templates && this.props.event_templates.length > 0) {

      let systemTemplates = this.props.event_templates.filter(template => template.system_template == true)
      return systemTemplates.map((template) => {

        let edit_icon = (this.props.roles.includes("admin"))? (<Link to="#" onClick={ () => this.handleEventTemplateSelect(template.id) }><OverlayTrigger placement="top" overlay={editTooltip}><FontAwesomeIcon icon='pencil-alt' fixedWidth/></OverlayTrigger></Link>): null
        let delete_icon = (this.props.roles.includes("admin"))? (<Link to="#" onClick={ () => this.handleEventTemplateDelete(template.id) }><OverlayTrigger placement="top" overlay={deleteTooltip}><FontAwesomeIcon icon='trash' fixedWidth/></OverlayTrigger></Link>): null
        return (
          <tr key={template.id}>
            <td>{template.event_name}</td>
            <td>{template.event_value}</td>
            <td>
              {edit_icon}{' '}
              {delete_icon}
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
    if(this.props.event_templates && this.props.event_templates.filter(template => template.system_template === false).length > 0){
      return (
        <Table responsive bordered striped>
          <thead>
            <tr>
              <th>Button Name</th>
              <th>Event Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.renderEventTemplates()}
          </tbody>
        </Table>
      )
    } else {
      return (
        <Panel.Body>
          No Event Templates found!
        </Panel.Body>
      )
    }
  }

  renderSystemEventTemplatesTable() {
    if(this.props.event_templates && this.props.event_templates.filter(template => template.system_template === true).length > 0){
      return (
        <Table responsive bordered striped>
          <thead>
            <tr>
              <th>Button Name</th>
              <th>Event Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.renderSystemEventTemplates()}
          </tbody>
        </Table>
      )
    } else {
      return (
        <Panel.Body>No System Event Templates found!</Panel.Body>
      )
    }
  }

  renderEventTemplatesHeader() {

    const Label = "Event Templates"

    // const importTooltip = (<Tooltip id="importTooltip">Import Event Templates</Tooltip>)
    const exportTooltip = (<Tooltip id="exportTooltip">Export Event Templates</Tooltip>)
    const deleteAllNonSystemTooltip = (<Tooltip id="deleteAllNonSystemTooltip">Delete ALL non-system Event Templates</Tooltip>)

    const disableBtn = (this.props.event_templates.filter(event_template => event_template.system_template === false).length > 0)? false : true

    return (
      <div>
        { Label }
        <div className="pull-right">
          <OverlayTrigger placement="top" overlay={deleteAllNonSystemTooltip}><Button bsStyle="default" bsSize="xs" type="button" onClick={ () => this.handleNonSystemEventTemplatesWipe() } disabled={disableBtn}><FontAwesomeIcon icon='trash' fixedWidth/></Button></OverlayTrigger>
          <OverlayTrigger placement="top" overlay={exportTooltip}><Button bsStyle="default" bsSize="xs" type="button" onClick={ () => this.exportTemplatesToJSON() } disabled={disableBtn}><FontAwesomeIcon icon='download' fixedWidth/></Button></OverlayTrigger>
        </div>
      </div>
    );
  }

  renderSystemEventTemplatesHeader() {

    const Label = "System Templates (Added/Edited by Admins only)"

    const exportTooltip = (<Tooltip id="exportTooltip">Export System Event Templates</Tooltip>)

    let export_icon = (this.props.roles.includes("admin"))? (<OverlayTrigger placement="top" overlay={exportTooltip}><Button bsStyle="default" bsSize="xs" type="button" onClick={ () => this.exportSystemTemplatesToJSON() }><FontAwesomeIcon icon='download' fixedWidth/></Button></OverlayTrigger>) : null

    return (
      <div>
        { Label }
        <div className="pull-right">
          {export_icon}
        </div>
      </div>
    );
  }

  render() {
    if (!this.props.roles) {
        return (
          <div>Loading...</div>
        )
    }

    if (this.props.roles.includes("admin") || this.props.roles.includes("event_manager")) {

      let eventTemplatesForm = (this.props.event_templateid)? <UpdateEventTemplate /> : <CreateEventTemplate />

      return (
        <Grid fluid>
          <DeleteEventTemplateModal />
          <NonSystemEventTemplatesWipeModal />
          <ImportEventTemplatesModal handleExit={this.handleEventTemplateImportClose} />
          <Row>
            <Col sm={8} md={6} lgOffset= {1} lg={5}>
              <Panel>
               <Panel.Heading>{this.renderSystemEventTemplatesHeader()}</Panel.Heading>
                {this.renderSystemEventTemplatesTable()}
              </Panel>
              <Panel>
                <Panel.Heading>{this.renderEventTemplatesHeader()}</Panel.Heading>
                {this.renderEventTemplatesTable()}
              </Panel>
              {this.renderAddEventTemplateButton()}
              {this.renderImportEventTemplatesButton()}
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