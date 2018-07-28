import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reduxForm, Field, reset } from 'redux-form';
import { FormGroup, Grid, Row, Button, Col, Panel, Alert, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { ROOT_PATH } from '../url_config';
import CreateLowering from './create_lowering';
import UpdateLowering from './update_lowering';
import * as actions from '../actions';

let fileDownload = require('js-file-download');

class Lowerings extends Component {

  constructor (props) {
    super(props);

  }

  componentWillMount() {
      this.props.fetchLowerings();
  }

  handleLoweringDelete(id) {
    this.props.showModal('deleteLowering', { id: id, handleDelete: this.props.deleteLowering });
  }

  handleLoweringSelect(id) {
    // console.log("Set Lowering:", id)
    this.props.initLowering(id);
  }

  handleLoweringCreate() {
    // console.log("Clear");
    this.props.leaveUpdateLoweringForm()
  }

  exportLoweringsToJSON() {
    fileDownload(JSON.stringify(this.props.lowerings, null, 2), 'seaplay_loweringExport.json');
  }

  renderAddLoweringButton() {
    if (!this.props.showform && this.props.roles && this.props.roles.includes('admin')) {
      return (
        <div className="pull-right">
          <Button bsStyle="primary" bsSize="small" type="button" onClick={ () => this.handleLoweringCreate()}>Add Lowering</Button>
        </div>
      );
    }
  }

  renderLowerings() {

    const editTooltip = (<Tooltip id="editTooltip">Edit this lowering.</Tooltip>)
    const deleteTooltip = (<Tooltip id="deleteTooltip">Delete this lowering.</Tooltip>)

    if(this.props.lowerings && this.props.lowerings.length > 0){
      return this.props.lowerings.map((lowering) => {
        
        let deleteLink = (this.props.roles.includes('admin'))? <Link key={`delete_${lowering.id}`} to="#" onClick={ () => this.handleLoweringDelete(lowering.id) }><OverlayTrigger placement="top" overlay={deleteTooltip}><FontAwesome name='trash' fixedWidth/></OverlayTrigger></Link>: null
        
        return (
          <tr key={lowering.id}>
            <td>{lowering.lowering_id}</td>
            <td>{lowering.lowering_pilot}</td>
            <td>{lowering.lowering_location}</td>
            <td>
              <Link key={`edit_${lowering.id}`} to="#" onClick={ () => this.handleLoweringSelect(lowering.id) }><OverlayTrigger placement="top" overlay={editTooltip}><FontAwesome name='pencil' fixedWidth/></OverlayTrigger></Link>
              {' '}
              { deleteLink }
            </td>
          </tr>
        );
      })      
    }

    return (
      <tr key="noLoweringsFound">
        <td colSpan="4"> No lowerings found!</td>
      </tr>
    )
  }

  renderLoweringTable() {
    return (
      <Panel>
        <Table responsive bordered striped fill>
          <thead>
            <tr>
              <th>Lowering</th>
              <th>Pilot</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.renderLowerings()}
          </tbody>
        </Table>
      </Panel>
    )
  }

  renderLoweringHeader() {

    const Label = "Lowerings"
    const exportTooltip = (<Tooltip id="exportTooltip">Export Lowerings</Tooltip>)

    return (
      <div>
        { Label }
        <div className="pull-right">
          <Button bsStyle="default" bsSize="xs" type="button" onClick={ () => this.exportLoweringsToJSON() }><OverlayTrigger placement="top" overlay={exportTooltip}><FontAwesome name='download' fixedWidth/></OverlayTrigger></Button>
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

    if(this.props.roles.includes("admin") || this.props.roles.includes('cruise_manager')) {

      let loweringForm = (this.props.lowerings.length > 0)? <UpdateLowering id={this.props.lowerings[0].id} /> : <CreateLowering />

      return (
        <Grid fluid>
          <Row>
            <Col sm={6} smOffset={3} md={5} mdOffset={4} lg={4} lgOffset={4}>
              { loweringForm }
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
    lowerings: state.lowering.lowerings,
    loweringid: state.lowering.lowering.id,
    roles: state.user.profile.roles
  }
}

export default connect(mapStateToProps, actions)(Lowerings);