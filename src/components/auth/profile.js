import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { reduxForm, Field, initialize } from 'redux-form';
import { Alert, Button, Col, FormGroup, FormControl, Panel, Row } from 'react-bootstrap';
import { API_ROOT_URL } from '../../url_config';
import * as actions from '../../actions';

const style = {wordWrap:'break-word'}
const cookies = new Cookies();

class Profile extends Component {

  constructor (props) {
    super(props);

    this.state = {
      token: null
    }

  }

  componentDidUpdate() {

    if(this.props.userID && !this.state.token) {
      axios.get(`${API_ROOT_URL}/api/v1/users/${this.props.userID}/token`,
      {
        headers: {
          authorization: cookies.get('token'),
          'content-type': 'application/json'
        }
      })
      .then((response) => {

        // console.log("Token Found");
        this.setState( { token: response.data.token} )
      })
      .catch((error) => {
        this.setState( {token: "There was an error retriving the JWT for this user."})
      })
    }
  }

  componentWillUnmount() {
    this.props.leaveUpdateProfileForm();
  }

  handleFormSubmit(formProps) {
    this.props.updateProfile(formProps);
  }

  renderField({ input, label, type, required, meta: { touched, error, warning } }) {

    let requiredField = (required)? (<span className='text-danger'> *</span>) : ''

    return (
      <FormGroup>
        <label>{label}{requiredField}</label>
        <FormControl {...input} placeholder={label} type={type}/>
        {touched && ((error && <div className='text-danger'>{error}</div>) || (warning && <div className='text-danger'>{warning}</div>))}
      </FormGroup>
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
    const profileFormHeader = (<h4>User Profile</h4>);

    return (
      <Row>
        <Col>
          <Panel className="form-signin">
            <Panel.Body>
              { profileFormHeader }
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
                {this.renderAlert()}
                {this.renderMessage()}
                <div className="pull-right">
                  <Button bsStyle="default" type="button" disabled={pristine || submitting} onClick={reset}>Reset Values</Button>
                  <Button bsStyle="primary" type="submit" disabled={pristine || submitting || !valid}>Update</Button>
                </div>
                <br />
                <br />
                <div>
                  <label>Token:</label>
                  <div style={style}>{this.state.token}</div>
                </div>
              </form>
            </Panel.Body>
          </Panel>
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

  return errors;

}

function mapStateToProps(state) {

  return {
    errorMessage: state.user.profile_error,
    message: state.user.profile_message,
    initialValues: state.user.profile,
    userID: state.user.profile.id
  };

}

Profile = reduxForm({
  form: 'profile',
  enableReinitialize: true,
  validate: validate
})(Profile);

export default connect(mapStateToProps, actions)(Profile);