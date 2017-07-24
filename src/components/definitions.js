import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reduxForm, Field, reset } from 'redux-form';
import { FormGroup, Grid, Row, Button, Col, Panel, Alert, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { ROOT_PATH } from '../url_config';
import DeleteDefinitionModal from './delete_definition_modal';
import * as actions from '../actions';

class Definitions extends Component {

  componentWillMount() {
      this.props.fetchDefinitions();
  }

  handleDefinitionDelete(id) {
    this.props.showModal('deleteDefinition', { id: id, handleDelete: this.props.deleteDefinition });
  }

  renderAddDefinitionButton() {
    if (!this.props.showform) {
      return (
        <div className="pull-right">
          <LinkContainer to={`${ROOT_PATH}/definitions/new`}>
            <Button bsStyle="primary" type="button">Add New Definition</Button>
          </LinkContainer>
        </div>
      );
    }
  }

  renderDefinitions() {
    return this.props.definitions.map((definition) => {
      //console.log(definition);
      return (
        <tr key={definition.id}>
          <td>{definition.event_name}</td>
          <td>
            <Link to={`${ROOT_PATH}/definitions/${definition.id}`}>Edit</Link>&nbsp;
            <Link to="#" onClick={ () => this.handleDefinitionDelete(definition.id) }>Delete</Link>
          </td>
        </tr>
      );
    })      
  }

  renderDefinitionsTable() {
    if(this.props.definitions.length > 0){
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
              {this.renderDefinitions()}
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
              <DeleteDefinitionModal />
              {this.renderDefinitionsTable()}
              {this.renderAddDefinitionButton()}
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
  //console.log(state.definition);
  return {
    definitions: state.definition.definitions,
    roles: state.user.profile.roles
  }
}

export default connect(mapStateToProps, actions)(Definitions);