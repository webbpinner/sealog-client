import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, initialize } from 'redux-form';
import { Alert, Button, Checkbox, Col, FormGroup, FormControl, FormGroupItem, Panel, Row, Tooltip, OverlayTrigger} from 'react-bootstrap';
import * as actions from '../actions';
import { standardUserRoleOptions } from '../standard_user_role_options';
import { systemUserRoleOptions } from '../system_user_role_options';

class UpdateUser extends Component {

  componentWillMount() {
    // console.log(this.props);
    if(this.props.userID) {
      this.props.initUser(this.props.userID);
    }
  }

  componentWillUnmount() {
    this.props.leaveUpdateUserForm();
  }

  handleFormSubmit(formProps) {
    // console.log(formProps);
    this.props.updateUser(formProps);
  }

  renderField({ input, label, type, required, meta: { touched, error, warning } }) {
    let requiredField = (required)? <span className='text-danger'> *</span> : ''
    return (
      <FormGroup>
        <label>{label}{requiredField}</label>
        <FormControl {...input} placeholder={label} type={type}/>
        {touched && ((error && <div className='text-danger'>{error}</div>) || (warning && <div className='text-danger'>{warning}</div>))}
      </FormGroup>
    )
  }

  renderCheckboxGroup({ label, name, options, input, required, meta: { dirty, error, warning } }) {

    let requiredField = (required)? (<span className='text-danger'> *</span>) : ''
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
            {overlay}
          </Checkbox>
      );
    });

    return (
      <FormGroup>
        <label>{label}{requiredField}</label>
        {checkboxList}
        {dirty && ((error && <div className='text-danger'>{error}</div>) || (warning && <div className='text-danger'>{warning}</div>))}
      </FormGroup>
    );
  }

  renderCheckbox({ input, label, meta: { dirty, error, warning } }) {    

    return (
      <FormGroup>
        <Checkbox
          checked={input.value ? true : false}
          onChange={(e) => input.onChange(e.target.checked)}
        >
          {label}
        </Checkbox>
        {(error && <div className='text-danger'>{error}</div>) || (warning && <div className='text-danger'>{warning}</div>)}
      </FormGroup>
    );
  }

  renderAdminOptions() {
    if(this.props.roles.includes('admin')) {
      return (
        <div>
          <label>Additional Options:</label>
          {this.renderSystemUserOption()}
        </div>
      )
    }
  }

  renderSystemUserOption() {
    return (
      <Field
        name="system_user"
        label="System User?"
        component={this.renderCheckbox}
      />
    )
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
    const updateUserFormHeader = (<div>Update User</div>);


    if (this.props.roles && (this.props.roles.includes("admin") || this.props.roles.includes('event_manager'))) {

      let userRoleOptions = this.props.roles.includes('admin')? systemUserRoleOptions.concat(standardUserRoleOptions): standardUserRoleOptions;

      return (
        <Panel>
          <Panel.Heading>
          {updateUserFormHeader}
          </Panel.Heading>
          <Panel.Body>
            <form onSubmit={ handleSubmit(this.handleFormSubmit.bind(this)) }>
              <Field
                name="username"
                component={this.renderField}
                type="text"
                label="Username"
                required={true}
              />
              <Field
                name="fullname"
                type="text"
                component={this.renderField}
                label="Full Name"
                required={true}
              />
              <Field
                name="email"
                component={this.renderField}
                type="text"
                label="Email"
                required={true}
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
                required={true}
              />
              {this.renderAdminOptions()}
              {this.renderAlert()}
              {this.renderMessage()}
              <div className="pull-right">
                <Button bsStyle="default" type="button" disabled={pristine || submitting} onClick={reset}>Reset Values</Button>
                <Button bsStyle="primary" type="submit" disabled={submitting || !valid}>Update</Button>
              </div>
            </form>
          </Panel.Body>
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