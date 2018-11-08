import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom';
import { Row, Col, FormGroup, Panel, Button } from 'react-bootstrap';
import * as actions from '../../actions';

class Register extends Component {

  componentWillUnmount() {
    this.props.leaveRegisterForm();
  }

  handleFormSubmit(formProps) {
    //console.log(username, fullName, password, confirmPassword, email);
    this.props.registerUser(formProps);
  }

  renderField({ input, label, type, required, meta: { touched, error, warning } }) {

    let requiredField = (required)? (<span className='text-danger'> *</span>) : ''    

    return (
      <div className="form-group">
        <label>{label}{requiredField}</label>
        <div>
          <input className="form-control" {...input} placeholder={label} type={type}/>
          {touched && ((error && <div className='text-danger'>{error}</div>) || (warning && <div className='text-danger'>{warning}</div>))}
        </div>
      </div>
    )
  }

  renderMessage() {
    if (this.props.message) {
      return (
        <Alert bsStyle="success">
          <strong>Success!</strong> {this.props.message}
        </Alert>
      )
    }
  }

  renderSuccess() {
    if (this.props.message) {
      const panelHeader = (<h4>New User Registration</h4>);

      return (
        <Panel className="form-signin">
          <Panel.Body>
            {panelHeader}>
            {this.renderMessage()}
            <div className="text-right">
              <Link to={ `/login` }>Proceed to Login {<FontAwesomeIcon icon="arrow-right"/>}</Link>
            </div>
          </Panel.Body>
        </Panel>
      )
    }
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Opps!</strong> {this.props.errorMessage}
        </div>
      )
    }
  }

  renderForm() {

    if (!this.props.message) {

      const panelHeader = (<h4>New User Registration</h4>);
      const { handleSubmit, pristine, reset, submitting, valid } = this.props;
      //console.log(this.props);

      return (
        <Panel className="form-signin">
          <Panel.Body>
            {panelHeader}
            <form onSubmit={ handleSubmit(this.handleFormSubmit.bind(this)) }>
              <div className="form-group">
                <Field
                  name="username"
                  component={this.renderField}
                  type="text"
                  label="Username"
                  required={true}
                />
              </div>
              <div className="form-group">
                <Field
                  name="fullname"
                  type="text"
                  component={this.renderField}
                  label="Full Name"
                  required={true}
                />
              </div>
              <div className="form-group">
                <Field
                  name="email"
                  component={this.renderField}
                  type="text"
                  label="Email"
                  required={true}
                />
              </div>
              <div className="form-group">
                <Field
                  name="password"
                  component={this.renderField}
                  type="password"
                  label="Password"
                />
              </div>
              <div className="form-group">
                <Field
                  name="confirmPassword"
                  component={this.renderField}
                  type="password"
                  label="Confirm Password"
                />
              </div>
              {this.renderAlert()}
              <div className="pull-right">
                <Button bsStyle="default" bsSize="small" type="button" disabled={pristine || submitting} onClick={reset} >Clear Values</Button>
                <Button bsStyle="primary" bsSize="small" type="submit" disabled={submitting || !valid} >Register</Button>
              </div>
            </form>
            <br/>
            <br/>
            <br/>
            <div>
              <Link to={ `/login` }>{<FontAwesomeIcon icon="arrow-left" />} Back to Login</Link>
            </div>
          </Panel.Body>
        </Panel>
      )
    }
  }

  render() {

    const panelHeader = (<h3>New User Registration</h3>);

    return(
        <Row>
          <Col>
            {this.renderSuccess()}
            {this.renderForm()}
          </Col>
        </Row>
    )
  }
}

function validate(formProps) {
  const errors = {};

  if (!formProps.username) {
    errors.username = 'Required'
  } else if (formProps.username.length > 15) {
    errors.username = 'Must be 15 characters or less'
  } else if (formProps.username.match(/[A-Z]/)) {
    errors.username = 'Username must be all lowercase'
  } else if (formProps.username.match(/[ ]/)) {
    errors.username = 'Username can not include whitespace'
  }

  if (!formProps.fullname) {
    errors.fullname = 'Required'
  }

  if (!formProps.email) {
    errors.email = 'Required'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formProps.email)) {
    errors.email = 'Invalid email address'
  }

  if(formProps.password !== formProps.confirmPassword) {
    errors.password = "Passwords must match";
  }

  return errors;

}

function mapStateToProps(state) {
  return {
    errorMessage: state.user.register_error,
    message: state.user.register_message
  };

}

Register = reduxForm({
  form: 'register',
  validate: validate
})(Register);

export default connect(mapStateToProps, actions)(Register);