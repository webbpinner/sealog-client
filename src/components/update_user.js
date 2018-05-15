import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, initialize, Form } from 'redux-form';
import { Alert, Button, Checkbox, Col, FormGroup, FormControl, FormGroupItem, Grid, Panel, Row, Tooltip, OverlayTrigger } from 'react-bootstrap';
import * as actions from '../actions';
import { userRoleOptions } from '../user_role_options';

    // 
    // console.log(disabled)


class UpdateUser extends Component {

  constructor (props) {
    super(props);

  }

  componentWillMount() {
    //console.log(this.props.match);
    if(this.props.userID) {
      this.props.initUser(this.props.userID);
    }
  }

  componentWillUnmount() {
    this.props.leaveUpdateUserForm();
  }

  handleFormSubmit(formProps) {
    //console.log(formProps);
    this.props.updateUser(formProps);
  }

  renderField({ input, label, type, disabled, meta: { touched, error, warning } }) {
    return (
      <FormGroup>
        <label>{label}</label>
        <FormControl {...input} placeholder={label} type={type} disabled={disabled}/>
        {touched && ((error && <div className='text-danger'>{error}</div>) || (warning && <div className='text-danger'>{warning}</div>))}
      </FormGroup>
    )
  }

  renderCheckboxGroup({ label, required, name, options, input, disabled, meta: { dirty, error, warning } }) {    

    let checkboxList = options.map((option, index) => {

      let tooltip = (option.description)? (<Tooltip id={`${option.value}_Tooltip`}>{option.description}</Tooltip>) : null
      let overlay = (tooltip != null)? (<OverlayTrigger placement="right" overlay={tooltip}><span>{option.label}</span></OverlayTrigger>) : option.label

      return (
          <Checkbox
            name={`${option.label}[${index}]`}
            key={`${label}.${index}`}
            value={option.value}
            checked={input.value.indexOf(option.value) !== -1}
            disabled={disabled}
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
    const updateUserFormHeader = (<div>User Profile</div>);

    if (this.props.roles && this.props.roles.includes("admin")) {
      return (
        <Panel bsStyle="default" header={updateUserFormHeader}>
          <Form onSubmit={ handleSubmit(this.handleFormSubmit.bind(this)) }>
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
              <Button bsStyle="default" type="button" disabled={pristine || submitting} onClick={reset}>Reset Values</Button>
              <Button bsStyle="primary" type="submit" disabled={submitting || !valid}>Update</Button>
            </div>
          </Form>
       </Panel>
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