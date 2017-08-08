import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reduxForm, Field, reset } from 'redux-form';
import { FormGroup, Grid, Row, Button, Col, Panel, Alert, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { ROOT_PATH } from '../url_config';
import DeleteExportModal from './delete_export_modal';
import * as actions from '../actions';

class Exports extends Component {

  componentWillMount() {
      this.props.fetchExportTemplates();
  }

  handleExportTemplateDelete(id) {
    this.props.showModal('deleteExport', { id: id, handleDelete: this.props.deleteExportTemplate });
  }

  handleExportTemplateRun(id) {
    this.props.runExportTemplate(id);
  }

  renderAddExportTemplateButton() {
    if (!this.props.showform) {
      return (
        <div className="pull-right">
          <LinkContainer to={`${ROOT_PATH}/exports/new`}>
            <Button bsStyle="primary" bsSize="small" type="button">Add Export</Button>
          </LinkContainer>
        </div>
      );
    }
  }

  renderExportTemplates() {

    const editTooltip = (<Tooltip id="editTooltip">Edit this export.</Tooltip>)
    const deleteTooltip = (<Tooltip id="deleteTooltip">Delete this export.</Tooltip>)
    const runTooltip = (<Tooltip id="deleteTooltip">Run this export.</Tooltip>)

    return this.props.exports.map((exportTemplate) => {
      //console.log(exportTemplate);
      return (
        <tr key={exportTemplate.id}>
          <td>{exportTemplate.event_export_template_name}</td>
          <td>
            <Link className="btn-default" to={`${ROOT_PATH}/exports/${exportTemplate.id}`}><OverlayTrigger placement="top" overlay={editTooltip}><FontAwesome name='pencil' fixedWidth/></OverlayTrigger></Link>
            <Link className="btn-default" to="#" onClick={ () => this.handleExportTemplateDelete(exportTemplate.id) }><OverlayTrigger placement="top" overlay={deleteTooltip}><FontAwesome name='trash' fixedWidth/></OverlayTrigger></Link>
            <Link className="btn-default" to="#" onClick={ () => this.handleExportTemplateRun(exportTemplate.id) }><OverlayTrigger placement="top" overlay={runTooltip}><FontAwesome name='download' fixedWidth/></OverlayTrigger></Link> 
          </td>
        </tr>
      );
    })      
  }

  renderExportTemplatesTable() {
    if(this.props.exports.length > 0){
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
              {this.renderExportTemplates()}
            </tbody>
          </Table>
        </Panel>
      )
    }
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
                <DeleteExportModal />
                {this.renderExportTemplatesTable()}
                {this.renderAddExportTemplateButton()}
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
    exports: state.export.exports,
    roles: state.user.profile.roles

  }
}

export default connect(mapStateToProps, actions)(Exports);