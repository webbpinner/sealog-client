import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, initialize } from 'redux-form';
import { Alert, Button, Checkbox, Col, FormGroup, FormControl, FormGroupItem, Grid, Panel, Row } from 'react-bootstrap';
import * as actions from '../actions';


class CreateDefinition extends Component {

  componentWillUnmount() {
    this.props.leaveCreateDefinitionForm();
  }

  handleFormSubmit(formProps) {
    //console.log(formProps);
    this.props.createDefinition(formProps);
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
    const formHeader = (<h3>Event Definition Profile</h3>);


    if (this.props.roles && (this.props.roles.includes("admin") || this.props.roles.includes("event_manager"))) {
      return (
        <Grid fluid>
          <Row>
            <Col sm={8} smOffset={2} md={6} mdOffset={3} lg={4} lgOffset={4}>
              <Panel bsStyle="default" header={formHeader}>
                <form onSubmit={ handleSubmit(this.handleFormSubmit.bind(this)) }>
                  <Field
                    name="event_name"
                    component={this.renderField}
                    type="text"
                    label="Name"
                  />
                  <Field
                    name="event_value"
                    type="text"
                    component={this.renderField}
                    label="Event Value"
                  />
                  {this.renderAlert()}
                  {this.renderMessage()}
                  <div className="pull-right">
                    <Button bsStyle="default" type="button" disabled={pristine || submitting} onClick={reset}>Reset Values</Button>
                    <Button bsStyle="primary" type="submit" disabled={pristine || submitting || !valid}>Update</Button>
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

  if (!formProps.event_name) {
    errors.event_name = 'Required'
  } else if (formProps.event_name.length > 15) {
    errors.event_name = 'Must be 15 characters or less'
  }

  if (!formProps.event_value) {
    errors.event_value = 'Required'
  }

  //console.log(errors);
  return errors;

}

function mapStateToProps(state) {

  return {
    errorMessage: state.definition.definition_error,
    message: state.definition.definition_message,
    roles: state.user.profile.roles,
  };

}

CreateDefinition = reduxForm({
  form: 'createDefinition',
  enableReinitialize: true,
  validate: validate
})(CreateDefinition);

export default connect(mapStateToProps, actions)(CreateDefinition);