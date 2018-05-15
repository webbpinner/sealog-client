import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Grid, Row, Col, FormGroup, Panel, Button, Alert, Image } from 'react-bootstrap';
import * as actions from '../../actions';
import { ROOT_PATH } from '../../url_config';

class Login extends Component {
 
 constructor (props) {
    super(props);

    this.state = { stdUsers: true }

  }

  componentWillUnmount() {
    this.props.leaveLoginForm();
  }

  handleFormSubmit({ username, password }) {
    username = username.toLowerCase();
    this.props.login({username, password});
  }

  renderAlert(){
    if(this.props.errorMessage) {
      return (
        <Alert bsStyle="danger">
          <strong>Opps!</strong> {this.props.errorMessage}
        </Alert>
      )
    } else if (this.props.successMessage) {
      return (
        <Alert bsStyle="success">
          <strong>Sweet!</strong> {this.props.successMessage}
        </Alert>
      )
    }
  }
 
  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    const loginPanelHeader = (<h3>Please Sign In</h3>);

    const quickLogin = (
      <Panel header={loginPanelHeader}>
        <Button bsStyle="primary" onClick={() => this.props.switch2Pilot()} block>Pilot</Button>
        <Button bsStyle="primary" onClick={() => this.props.switch2StbdObs()} block>Starboard Observer</Button>
        <Button bsStyle="primary" onClick={() => this.props.switch2PortObs()} block>Port Observer</Button>
        <br/>
        <div className="text-right">
          <Link to={'#'} onClick={ () => this.setState({stdUsers: false})}>Use Custom Login{' '}{<FontAwesome name="arrow-right"/>}</Link>
        </div>
      </Panel>
    )

    const customLogin = (
      <Panel header={loginPanelHeader}>
        <form onSubmit={ handleSubmit(this.handleFormSubmit.bind(this)) }>
          <FormGroup>
            <Field
              name="username"
              component="input"
              type="text"
              placeholder="Username"
              className="form-control"
            />
          </FormGroup>
          <FormGroup>
            <Field
              name="password"
              component="input"
              type="password"
              placeholder="Password"
              className="form-control"
            />
          </FormGroup>
          {this.renderAlert()}
          <div>
            <Button bsStyle="primary" type="submit" block>Submit</Button>
          </div>
        </form>
        <br/>
        <div>
          <Link to={'#'} onClick={ () => this.setState({stdUsers: true})} >{<FontAwesome name="arrow-left"/>}{' '}Back</Link>
          <span className="pull-right">
            <Link to={ `/register` }>Register New User{' '}{<FontAwesome name="arrow-right"/>}</Link>
          </span>
        </div>
      </Panel>
    )

    return (
      <Grid>
        <Row>
          <Col sm={4} smOffset={1} md={4} mdOffset={2}>
            {(this.state.stdUsers)? quickLogin : customLogin }
          </Col>
          <Col sm={6} md={6}>
            <Image className="text-center" src={`${ROOT_PATH}/images/Alvin_Profile.png`} />
          </Col>
        </Row>
      </Grid>
    )
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    successMessage: state.auth.message
  }
}

Login = reduxForm({
  form: 'login'
})(Login);

export default connect(mapStateToProps, actions)(Login);