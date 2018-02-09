import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, NavItem, MenuItem } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome'
import { LinkContainer } from 'react-router-bootstrap';
import * as actions from '../actions';
import { ROOT_PATH } from '../url_config';

class Header extends Component {

  constructor (props) {
    super(props);
  }

  componentWillMount() {
    if (this.props.authenticated) {
      this.props.updateProfileState();
    }
  }

  renderUserOptions() {
    if(this.props.authenticated && this.props.roles) {
      if(this.props.roles.includes('admin')) {
        return (
          <LinkContainer to={ `${ROOT_PATH}/users` }>
            <NavItem>Users</NavItem>
          </LinkContainer>
        );
      }
    }
  }

  renderEventOptions() {
    if(this.props.authenticated && this.props.roles) {
      if(this.props.roles.includes('event_watcher')) {
        return (
          <LinkContainer to={ `${ROOT_PATH}/events` }>
            <NavItem>Events</NavItem>
          </LinkContainer>
        );
      }
    }
  }

  renderEventExportOptions() {
    if(this.props.roles) {
      if(this.props.roles.includes('admin') || this.props.roles.includes('event_manager') || this.props.roles.includes('event_logger') || this.props.roles.includes('event_watcher')) {
        return (
          <LinkContainer to={ `${ROOT_PATH}/event_exports` }>
            <NavItem>Exports</NavItem>
          </LinkContainer>
        );
      }
    }
  }

  renderEventTemplateOptions() {
    if(this.props.roles) {
      if(this.props.roles.includes('admin') || this.props.roles.includes('event_manager')) {
        return (
          <LinkContainer to={ `${ROOT_PATH}/event_templates` }>
            <NavItem>Templates</NavItem>
          </LinkContainer>
        );
      }
    }
  }

  renderUserDropdown() {
    if(this.props.fullname){
      return (
      <NavDropdown eventKey={3} title={<FontAwesome name='user' />} id="basic-nav-dropdown">
        <LinkContainer to={ `${ROOT_PATH}/profile` }>
          <MenuItem key="profile" eventKey={3.1} >User Profile</MenuItem>
        </LinkContainer>
        <MenuItem key="logout" eventKey={3.2} onClick={ () => this.handleLogout() } >Log Out</MenuItem>
      </NavDropdown>
      );
    } else {
      // show a link to sign in or sign up
      return (
        <LinkContainer to={ `${ROOT_PATH}/login` }>
          <NavItem>Login</NavItem>
        </LinkContainer>
      );
    }
  }

  handleLogout() {
    this.props.logout();
  }

  render () {
    return (
      <Navbar fluid collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to={ `${ROOT_PATH}/` }>Sea Log</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            {this.renderUserOptions()}
            {this.renderEventOptions()}
            {this.renderEventExportOptions()}
            {this.renderEventTemplateOptions()}
            {this.renderUserDropdown()}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

function mapStateToProps(state){
  return {
    authenticated: state.auth.authenticated,
    fullname: state.user.profile.fullname,
    roles: state.user.profile.roles
  };
}

export default connect(mapStateToProps, actions)(Header);