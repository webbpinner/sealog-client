import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reduxForm, Field, reset } from 'redux-form';
import { FormGroup, Grid, Row, Button, Col, Panel, Alert, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import CreateUser from './create_user';
import UpdateUser from './update_user';
import DeleteUserModal from './delete_user_modal';
import ImportUsersModal from './import_users_modal';
// import fileDownload from 'react-file-download';
import * as actions from '../actions';

class Users extends Component {

  constructor (props) {
    super(props);

    this.handleExportUserList = this.handleExportUserList.bind(this);
    this.handleImportUserList = this.handleImportUserList.bind(this);
  }

  componentWillMount() {
      this.props.fetchUsers();
  }

  handleUserDelete(id) {
    this.props.showModal('deleteUser', { id: id, handleDelete: this.props.deleteUser });
  }

  handleUserSelect(id) {
    // console.log("Set User:", id)
    this.props.initUser(id);
  }

  handleUserCreate() {
    // console.log("Clear");
    this.props.leaveUpdateUserForm()
  }

  handleExportUserList() {
    fileDownload(JSON.stringify(this.props.users, null, "\t"), 'export.json');
  }

  handleImportUserList() {
    this.props.showModal('importUsers', { });

    // const options = {
    //   baseUrl: 'http://127.0.0.1',
    //   query: {
    //     warrior: 'fight'
    //   }
    // }

    // /* Use ReactUploadFile with options */
    // /* Custom your buttons */
    // return (
    //   <ReactUploadFile options={options} uploadFileButton={<FontAwesome name='upload' fixedWidth/>} />
    // );
  }

  renderAddUserButton() {
    if (!this.props.showform) {
      return (
        <div className="pull-right">
          <Button bsStyle="primary" bsSize="small" type="button" onClick={ () => this.handleUserCreate()}>Add User</Button>
        </div>
      );
    }
  }

  renderUsers() {

    const editTooltip = (<Tooltip id="editTooltip">Edit this user.</Tooltip>)
    const deleteTooltip = (<Tooltip id="deleteTooltip">Delete this user.</Tooltip>)

    if(this.props.users){
      return this.props.users.map((user) => {
        return (
          <tr key={user.id}>
            <td>{user.username}</td>
            <td>{user.fullname}</td>
            <td>
              <Link key={`edit_${user.id}`} to="#" onClick={ () => this.handleUserSelect(user.id) }><OverlayTrigger placement="top" overlay={editTooltip}><FontAwesome name='pencil' fixedWidth/></OverlayTrigger></Link>
              &nbsp;
              {user.id != this.props.profileid? <Link key={`delete_${user.id}`} to="#" onClick={ () => this.handleUserDelete(user.id) }><OverlayTrigger placement="top" overlay={deleteTooltip}><FontAwesome name='trash' fixedWidth/></OverlayTrigger></Link> : ''}
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

  renderUserHeader() {

    const Label = "Users"

    // const importTooltip = (<Tooltip id="importTooltip">Import Users</Tooltip>)
    const exportTooltip = (<Tooltip id="exportTooltip">Export Users</Tooltip>)

    // <Button bsStyle="default" bsSize="xs" type="button" onClick={ this.handleImportUserList }><OverlayTrigger placement="top" overlay={importTooltip}><FontAwesome name='upload' fixedWidth/></OverlayTrigger></Button>

    return (
      <div>
        { Label }
      </div>
    );
  }

  render() {
    if (!this.props.roles) {
        return (
          <div>Loading...</div>
        )
    }

    if (this.props.roles.includes("admin")) {

      // console.log("userid:", this.props.userid)

      let userForm = (this.props.userid)? <UpdateUser /> : <CreateUser />

      return (
        <Grid fluid>
          <DeleteUserModal />
          <ImportUsersModal />
          <Row>
            <Col sm={6} mdOffset= {1} md={5} lgOffset= {2} lg={4}>
              <Panel header={this.renderUserHeader()}>
                {this.renderUserTable()}
              </Panel>
              {this.renderAddUserButton()}
            </Col>
            <Col sm={6} md={5} lg={4}>
              { userForm }
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
    userid: state.user.user.id,
    profileid: state.user.profile.id,
    roles: state.user.profile.roles
  }
}

export default connect(mapStateToProps, actions)(Users);