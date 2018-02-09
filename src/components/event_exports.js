import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reduxForm, Field, reset } from 'redux-form';
import { FormGroup, Grid, Row, Button, Col, Panel, Alert, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { ROOT_PATH } from '../url_config';
import DeleteEventExportModal from './delete_event_export_modal';
import fileDownload from 'react-file-download';
import * as actions from '../actions';

class EventExports extends Component {


  constructor (props) {
    super(props);

    this.handleEventExportList = this.handleEventExportList.bind(this);
//    this.handleImportExportList = this.handleImportExportList.bind(this);
  }

  componentWillMount() {
      this.props.fetchUsers();
      this.props.fetchEventExportTemplates();
  }

  handleEventExportList() {
    fileDownload(JSON.stringify(this.props.event_exports, null, "\t"), 'export.json');
  }

  handleEventExportTemplateDelete(id) {
    this.props.showModal('deleteExport', { id: id, handleDelete: this.props.deleteEventExportTemplate });
  }

  handleEventExportTemplateRun(id) {
    this.props.runEventExportTemplate(id);
  }

  renderAddEventExportTemplateButton() {
    if (!this.props.showform) {
      return (
        <div className="pull-right">
          <LinkContainer to={`${ROOT_PATH}/event_exports/new`}>
            <Button bsStyle="primary" bsSize="small" type="button">Add Export Template</Button>
          </LinkContainer>
        </div>
      );
    }
  }

  renderEventExportTemplates() {

    const editTooltip = (<Tooltip id="editTooltip">Edit this export template.</Tooltip>)
    const deleteTooltip = (<Tooltip id="deleteTooltip">Delete this export template.</Tooltip>)
    const runTooltip = (<Tooltip id="deleteTooltip">Run this export template.</Tooltip>)

    return this.props.event_exports.map((eventExportTemplate) => {
      return (
        <tr key={eventExportTemplate.id}>
          <td>{eventExportTemplate.event_export_template_name}</td>
          <td>
            <Link to={`${ROOT_PATH}/event_exports/${eventExportTemplate.id}`}><OverlayTrigger placement="top" overlay={editTooltip}><FontAwesome name='pencil' fixedWidth/></OverlayTrigger></Link>
            <Link to="#" onClick={ () => this.handleEventExportTemplateDelete(eventExportTemplate.id) }><OverlayTrigger placement="top" overlay={deleteTooltip}><FontAwesome name='trash' fixedWidth/></OverlayTrigger></Link>
            <Link to="#" onClick={ () => this.handleEventExportTemplateRun(eventExportTemplate.id) }><OverlayTrigger placement="top" overlay={runTooltip}><FontAwesome name='download' fixedWidth/></OverlayTrigger></Link> 
          </td>
        </tr>
      );
    })      
  }

  renderEventExportTemplatesTable() {
    if(this.props.event_exports.length > 0){
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
              {this.renderEventExportTemplates()}
            </tbody>
          </Table>
        </Panel>
      )
    }
  }

  renderEventExportHeader() {

    const Label = "Exports"

    // const importTooltip = (<Tooltip id="importTooltip">Import Users</Tooltip>)
    const exportTooltip = (<Tooltip id="exportTooltip">Export Exports</Tooltip>)

    // <Button bsStyle="default" bsSize="xs" type="button" onClick={ this.handleImportUserList }><OverlayTrigger placement="top" overlay={importTooltip}><FontAwesome name='upload' fixedWidth/></OverlayTrigger></Button>

    return (
      <div>
        { Label }
        <div className="pull-right">
          <Button bsStyle="default" bsSize="xs" type="button" onClick={ this.handleEventExportExportList }><OverlayTrigger placement="top" overlay={exportTooltip}><FontAwesome name='download' fixedWidth/></OverlayTrigger></Button>
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

    if (this.props.roles.includes("admin") || this.props.roles.includes("event_manager") || this.props.roles.includes("event_logger") || this.props.roles.includes("event_watcher")) {
      return (
        <Grid fluid>
          <Row>
            <Col sm={6} md={4} lg={4}>
                <DeleteEventExportModal />
                <Panel header={this.renderEventExportHeader()}>
                  {this.renderEventExportTemplatesTable()}
                  {this.renderAddEventExportTemplateButton()}
                </Panel>
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
    event_exports: state.event_export.event_exports,
    roles: state.user.profile.roles

  }
}

export default connect(mapStateToProps, actions)(EventExports);