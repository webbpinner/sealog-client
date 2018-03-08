import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, initialize } from 'redux-form';
import { Alert, Button, Checkbox, Col, FormGroup, FormControl, FormGroupItem, Grid, Panel, Row, Tooltip, OverlayTrigger } from 'react-bootstrap';
import * as actions from '../actions';
import { userRoleOptions } from '../user_role_options';

class CreateUser extends Component {

  componentWillUnmount() {
    this.props.leaveCreateUserForm();
  }

  handleFormSubmit(formProps) {
    //console.log(formProps);
    this.props.createUser(formProps);
  }

  renderField({ input, label, type, meta: { touched, error, warning } }) {
    return (
      <FormGroup>
        <label>{label}</label>
        <FormControl {...input} placeholder={label} type={type}/>
        {(error && <div className='text-danger'>{error}</div>) || (warning && <div className='text-danger'>{warning}</div>)}
      </FormGroup>
    )
  }

  renderCheckboxGroup({ label, name, options, input, meta: { dirty, error, warning } }) {    

    let checkboxList = options.map((option, index) => {
  
      let tooltip = (option.description)? (<Tooltip id={`${option.value}_Tooltip`}>{option.description}</Tooltip>) : null
      let overlay = (tooltip != null)? (<OverlayTrigger placement="right" overlay={tooltip}><span>{option.label}</span></OverlayTrigger>) : option.label
  
      return (
        <Checkbox
          name={`${option.label}[${index}]`}
          key={`${label}.${index}`}
          value={option.value}
          checked={input.value.indexOf(option.value) !== -1}
          onChange={event => {
            const newValue = [...input.value];
            if(event.target.checked) {
              newValue.push(option.value);
            } else {
              newValue.splice(newValue.indexOf(option.value), 1);
            }
            return input.onChange(newValue);
          }}
        >
          { overlay }
        </Checkbox>
      );
    });

    return (
      <FormGroup>
        <label>{label}</label>
        {checkboxList}
        {(error && <div className='text-danger'>{error}</div>) || (warning && <div className='text-danger'>{warning}</div>)}
      </FormGroup>
    );
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <Alert bsStyle="danger">
          <strong>Opps!</strong> {this.props.errorMessage}
        </Alert>
      )
    }
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

  render() {

    const { handleSubmit, pristine, reset, submitting, valid } = this.props;
    const createUserFormHeader = (<div>User Profile</div>);

    if (this.props.roles && this.props.roles.includes("admin")) {

      return (
        <Panel bsStyle="default" header={createUserFormHeader}>
          <form onSubmit={ handleSubmit(this.handleFormSubmit.bind(this)) }>
            <Field
              name="username"
              component={this.renderField}
              type="text"
              label="Username"
            />
            <Field
              name="fullname"
              type="text"
              component={this.renderField}
              label="Full Name"
            />
            <Field
              name="email"
              component={this.renderField}
              type="text"
              label="Email"
            />
            <Field
              name="password"
              component={this.renderField}
              type="password"
              label="Password"
            />
            <Field
              name="confirmPassword"
              component={this.renderField}
              type="password"
              label="Confirm Password"
            />
            <Field
              name="roles"
              component={this.renderCheckboxGroup}
              label="Roles"
              options={userRoleOptions}
            />
            {this.renderAlert()}
            {this.renderMessage()}
            <div className="pull-right">
              <Button bsStyle="default" bsSize="small" type="button" disabled={pristine || submitting} onClick={reset}>Reset Values</Button>
              <Button bsStyle="primary" bsSize="small" type="submit" disabled={submitting || !valid}>Create</Button>
            </div>
          </form>
        </Panel>
      )
    } else {
      return (
        <div>
          Loading...
        </div>
      )
    }
  }
}

function validate(formProps) {
  const errors = {};

  if (!formProps.username) {
    errors.username = 'Required'
  } else if (formProps.username.length > 15) {
    errors.username = 'Must be 15 characters or less'
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

  if(!formProps.roles || formProps.roles.length === 0) {
    errors.roles = "Must select at least one role";
  }

  return errors;

}

function mapStateToProps(state) {

  return {
    errorMessage: state.user.user_error,
    message: state.user.user_message,
    roles: state.user.profile.roles
  };

}

CreateUser = reduxForm({
  form: 'createUser',
  enableReinitialize: true,
  validate: validate
})(CreateUser);

export default connect(mapStateToProps, actions)(CreateUser);