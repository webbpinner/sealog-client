import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reduxForm, Field, reset } from 'redux-form';
import { FormGroup, Grid, Row, Button, Col, Panel, Alert, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { ROOT_PATH } from '../url_config';

import * as actions from '../actions';

class Users extends Component {

  componentWillMount() {
      this.props.fetchUsers();
  }

  handleUserDelete(id) {
    this.props.deleteUser(id);
  }

  renderAddUserButton() {
    if (!this.props.showform) {
      return (
        <div className="pull-right">
          <LinkContainer to={`${ROOT_PATH}/users/new`}>
            <Button bsStyle="primary" type="button">Add New User</Button>
          </LinkContainer>
        </div>
      );
    }
  }

  renderUsers() {
    if(this.props.users){
      return this.props.users.map((user) => {
        return (
          <tr key={user.id}>
            <td>{user.username}</td>
            <td>{user.fullname}</td>
            <td>
              <Link key={`edit_${user.id}`} to={`${ROOT_PATH}/users/${user.id}`}>Edit</Link>
              &nbsp;
              {user.id != this.props.userid? <Link key={`delete_${user.id}`} to="#" onClick={ () => this.handleUserDelete(user.id) }>Delete</Link> : <span>Delete</span>}
            </td>
          </tr>
        );
      })      
    }

    return (
      <tr key="noUsersFound">
        <td colSpan="5"> No users found!</td>
      </tr>
    )
  }

  renderUserTable() {
    return (
      <Panel>
        <Table responsive bordered striped fill>
          <thead>
            <tr>
              <th>User Name</th>
              <th>Full Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.renderUsers()}
          </tbody>
        </Table>
      </Panel>
    )
  }

  render() {
    if (!this.props.roles) {
        return (
          <div>Loading...</div>
        )
    }

    if (this.props.roles.includes("admin")) {
      return (
        <Grid fluid>
          <Row>
            <Col sm={6} md={4} lg={4}>
                {this.renderUserTable()}
                {this.renderAddUserButton()}
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
    users: state.user.users,
    userid: state.user.profile.id,
    roles: state.user.profile.roles

  }
}

export default connect(mapStateToProps, actions)(Users);