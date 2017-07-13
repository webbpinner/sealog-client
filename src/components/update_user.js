import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, initialize } from 'redux-form';
import { Alert, Button, Checkbox, Col, FormGroup, FormControl, FormGroupItem, Grid, Panel, Row } from 'react-bootstrap';
import * as actions from '../actions';
import { roleOptions } from '../role_options';

class UpdateUser extends Component {

  componentWillMount() {
    //console.log(this.props.match);
    this.props.initUser(this.props.match.params.id);
  }

  componentWillUnmount() {
    this.props.leaveUpdateUserForm();
  }

  handleFormSubmit(formProps) {
    //console.log(formProps);
    this.props.updateUser(formProps);
  }

  renderField({ input, label, type, meta: { touched, error, warning } }) {
    return (
      <FormGroup>
        <label>{label}</label>
        <FormControl {...input} placeholder={label} type={type}/>
        {touched && ((error && <div className='text-danger'>{error}</div>) || (warning && <div className='text-danger'>{warning}</div>))}
      </FormGroup>
    )
  }

  renderCheckboxGroup({ label, required, name, options, input, meta: { dirty, error, warning } }) {    

    let checkboxList = options.map((option, index) => {
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
            { option.label }
          </Checkbox>
      );
    });

    return (
      <FormGroup>
        <label>{label}</label>
        {checkboxList}
        {dirty && ((error && <div className='text-danger'>{error}</div>) || (warning && <div className='text-danger'>{warning}</div>))}
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
    const updateUserFormHeader = (<h3>User Profile</h3>);


    if (this.props.roles && this.props.roles.includes("admin")) {
      return (
        <Grid fluid>
          <Row>
            <Col sm={8} smOffset={2} md={6} mdOffset={3} lg={4} lgOffset={4}>
              <Panel bsStyle="default" header={updateUserFormHeader}>
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
                    options={roleOptions}
                  />
                  {this.renderAlert()}
                  {this.renderMessage()}
                  <div className="pull-right">
                    <Button bsStyle="default" type="button" disabled={pristine || submitting} onClick={reset}>Reset Values</Button>
                    <Button bsStyle="primary" type="submit" disabled={submitting || !valid}>Update</Button>
                  </div>
                </form>
              </Panel>
            </Col>
          </Row>
        </Grid>
      )
    } else {
      return (
        <div>
          What are YOU doing here?
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

  if (!formProps.fullName) {
    errors.fullName = 'Required'
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
    initialValues: state.user.user,
    roles: state.user.profile.roles
  };

}

UpdateUser = reduxForm({
  form: 'editUser',
  enableReinitialize: true,
  validate: validate
})(UpdateUser);

export default connect(mapStateToProps, actions)(UpdateUser);