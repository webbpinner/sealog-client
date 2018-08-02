import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, NavItem, MenuItem, Image } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome'
import { LinkContainer } from 'react-router-bootstrap';
import { ROOT_PATH } from '../url_config';
import * as actions from '../actions';

class Header extends Component {

  constructor (props) {
    super(props);
  }

  componentWillMount() {
    if (this.props.authenticated) {
      this.props.updateProfileState();
    }
    this.props.fetchCustomVars()
  }

  handleASNAPToggle() {
    if(this.props.asnapStatus) {
      if(this.props.asnapStatus[0].custom_var_value == 'Off') {
        this.props.updateCustomVars(this.props.asnapStatus[0].id, {custom_var_value: 'On'})
      } else {
        this.props.updateCustomVars(this.props.asnapStatus[0].id, {custom_var_value: 'Off'})
      }
    }
  }

  handleASNAPToggle() {
    if(this.props.asnapStatus) {
      if(this.props.asnapStatus[0].custom_var_value == 'Off') {
        this.props.updateCustomVars(this.props.asnapStatus[0].id, {custom_var_value: 'On'})
      } else {
        this.props.updateCustomVars(this.props.asnapStatus[0].id, {custom_var_value: 'Off'})
      }
    }
  }

  renderUserOptions() {
    if(this.props.roles.includes('admin') || this.props.roles.includes('event_manager')) {
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
          <NavItem>Event Review/Export</NavItem>
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

  renderToggleASNAP() {
    if(this.props.roles.includes('admin') || this.props.roles.includes('event_logger')) {
      return (
        <MenuItem onClick={ () => this.handleASNAPToggle() }>Toggle ASNAP</MenuItem>
      );
    }
  }

  renderSystemManagerDropdown() {
    if(this.props.roles && (this.props.roles.includes('admin') || this.props.roles.includes('event_manager') || this.props.roles.includes('event_manager'))) {
      return (
        <NavDropdown eventKey={3} title={'System Management'} id="basic-nav-dropdown">
          {this.renderEventTemplateOptions()}
          {this.renderTaskOptions()}
          {this.renderUserOptions()}
          {this.renderToggleASNAP()}
        </NavDropdown>
      );
    }
  }

  renderUserDropdown() {
    if(this.props.authenticated){
      return (
      <NavDropdown eventKey={3} title={<span>{this.props.fullname} <FontAwesome name='user' /></span>} id="basic-nav-dropdown">
        <LinkContainer to={ `/profile` }>
          <MenuItem key="profile" eventKey={3.1} >User Profile</MenuItem>
        </LinkContainer>
        <MenuItem key="logout" eventKey={3.3} onClick={ () => this.handleLogout() } >Log Out</MenuItem>
        {(this.props.fullname != 'Guest')? (<MenuItem key="switch2Guest" eventKey={3.3} onClick={ () => this.handleSwitchToGuest() } >Switch to Guest</MenuItem>) : null }
      </NavDropdown>
      );
    }
  }

  handleLogout() {
    this.props.logout();
  }

  handleSwitchToGuest() {
    this.props.switch2Guest();
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
  let asnapStatus = (state.custom_var)? state.custom_var.custom_vars.filter(custom_var => custom_var.custom_var_name == "asnapStatus") : []

  return {
    authenticated: state.auth.authenticated,
    fullname: state.user.profile.fullname,
    roles: state.user.profile.roles,
    asnapStatus: (asnapStatus.length > 0)? asnapStatus : null,
  };
}

export default connect(mapStateToProps, actions)(Header);
