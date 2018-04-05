import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, NavItem, MenuItem } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome'
import { LinkContainer } from 'react-router-bootstrap';
import * as actions from '../actions';

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
    if(this.props.roles.includes('admin')) {
      return (
        <LinkContainer to={ `/users` }>
          <NavItem>Users</NavItem>
        </LinkContainer>
      );
    }
  }

  renderEventExportOptions() {

    // console.log(this.props.roles)
    if(this.props.roles && (this.props.roles.includes('admin') || this.props.roles.includes('event_manager') || this.props.roles.includes('event_logger') || this.props.roles.includes('event_watcher'))) {
      return (
        <LinkContainer to={ `/event_exports` }>
          <NavItem>Event Export</NavItem>
        </LinkContainer>
      );
    }
  }

  renderEventTemplateOptions() {
    if(this.props.roles.includes('admin') || this.props.roles.includes('event_manager')) {
      return (
        <LinkContainer to={ `/event_templates` }>
          <NavItem>Event Templates</NavItem>
        </LinkContainer>
      );
    }
  }

  renderTaskOptions() {
    if(this.props.roles.includes('admin')) {
      return (
        <LinkContainer to={ `/tasks` }>
          <MenuItem>Tasks</MenuItem>
        </LinkContainer>
      );
    }
  }

  renderSystemManagerDropdown() {
    if(this.props.roles && (this.props.roles.includes('admin'))) {
      return (
        <NavDropdown eventKey={3} title={'System Management'} id="basic-nav-dropdown">
          {this.renderEventTemplateOptions()}
          {this.renderTaskOptions()}
          {this.renderUserOptions()}
        </NavDropdown>
      );
    }
  }

  renderUserDropdown() {
    if(this.props.fullname){
      return (
      <NavDropdown eventKey={3} title={<FontAwesome name='user' />} id="basic-nav-dropdown">
        <LinkContainer to={ `/profile` }>
          <MenuItem key="profile" eventKey={3.1} >User Profile</MenuItem>
        </LinkContainer>
        <MenuItem key="logout" eventKey={3.3} onClick={ () => this.handleLogout() } >Log Out</MenuItem>
      </NavDropdown>
      );
    } else {
      // show a link to sign in or sign up
      return (
        <LinkContainer to={ `/login` }>
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
            <Link to={ `/` }>Sealog</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            {this.renderEventExportOptions()}
            {this.renderSystemManagerDropdown()}
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