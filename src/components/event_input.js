import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, reset } from 'redux-form';
import { Button, InputGroup } from 'react-bootstrap';
import * as actions from '../actions';

class EventInput extends Component {

  handleFormSubmit({eventFreeText}) {
    this.props.createEvent('FREE_FORM', eventFreeText);
  }

  render() {
    const { handleSubmit, pristine, reset, submitting, valid } = this.props;
    return (
      <form onSubmit={ handleSubmit(this.handleFormSubmit.bind(this)) }>
        <InputGroup>
          <Field
            name="eventFreeText"
            component="input"
            type="text"
            placeholder="Type new event"
            className="form-control"
          />
          <span className="input-group-btn">
            <Button bsStyle="primary" block type="submit" disabled={submitting || !valid}>Submit</Button>
          </span>
        </InputGroup>
      </form>
    )
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    successMessage: state.auth.message
  }
}

function afterSubmit(result, dispatch) {
    dispatch(reset('eventInput'));
}

function validate(formProps) {
  const errors = {};

  if (!formProps.eventFreeText) {
    errors.eventFreeText = 'Required'
  }

  return errors;

}

EventInput = reduxForm({
  form: 'eventInput',
  onSubmitSuccess: afterSubmit,
  validate: validate
})(EventInput);

export default connect(mapStateToProps, actions)(EventInput);