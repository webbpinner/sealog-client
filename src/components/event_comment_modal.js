import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Checkbox, ControlLabel, FormGroup, FormControl, FormGroupItem, Modal } from 'react-bootstrap';
import { connectModal } from 'redux-modal';
import Datetime from 'react-datetime';
import Cookies from 'universal-cookie';
import moment from 'moment';
import axios from 'axios';
import { reduxForm, Field, initialize, formValueSelector } from 'redux-form';
import * as actions from '../actions';


import { API_ROOT_URL} from '../url_config';

const cookies = new Cookies();

const dateFormat = "YYYY-MM-DD"
const timeFormat = "HH:mm:ss"

class EventCommentModal extends Component {

  constructor (props) {
    super(props);

    this.renderDatePicker = this.renderDatePicker.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  static propTypes = {
    event: PropTypes.object.isRequired,
    handleHide: PropTypes.func.isRequired,
    handleUpdateEvent: PropTypes.func.isRequired
  };

  componentWillMount() {
  }

  componentWillUnmount() {
  }

  handleFormSubmit({event_comment = ''}) {

    let existing_comment = false;
    let event_options = this.props.event.event_options = this.props.event.event_options.map(event_option => {
      if(event_option.event_option_name == 'event_comment') {
        existing_comment = true;
        return { event_option_name: 'event_comment', event_option_value: event_comment}
      } else {
        return event_option
      }
    })

    if(!existing_comment) {
      event_options.push({ event_option_name: 'event_comment', event_option_value: event_comment})
    }

    this.props.handleUpdateEvent(this.props.event.id, this.props.event.event_value, this.props.event.event_free_text, event_options, this.props.event.ts);
    this.props.handleDestroy();
  }

  renderTextField({ input, label, type, required, meta: { touched, error, warning } }) {
    let requiredField = (required)? <span className='text-danger'> *</span> : ''
    let labelElement = (label)? <label>{label}{requiredField}</label> : ''
    return (
      <FormGroup>
        {labelElement}
        <FormControl {...input} placeholder={label} type={type}/>
        {touched && (error && <div className='text-danger'>{error}</div>) || (warning && <div className='text-danger'>{warning}</div>)}
      </FormGroup>
    )
  }

  renderTextArea({ input, label, required, meta: { touched, error, warning } }) {
    let requiredField = (required)? <span className='text-danger'> *</span> : ''
    let labelElement = (label)? <label>{label}{requiredField}</label> : ''
    return (
      <FormGroup>
        {labelElement}
        <FormControl {...input} placeholder={label} componentClass='textarea' rows={4}/>
        {touched && (error && <div className='text-danger'>{error}</div>) || (warning && <div className='text-danger'>{warning}</div>)}
      </FormGroup>
    )
  }

  renderSelectField({children, input, label, type, required, meta: { touched, error, warning } }) {
    let requiredField = (required)? <span className='text-danger'> *</span> : ''
    return (
      <FormGroup controlId="formControlsSelect">
        <ControlLabel>{label}{requiredField}</ControlLabel>
        <FormControl {...input} componentClass={type} placeholder={label}>
          {children}
        </FormControl>
        {touched && (error && <div className='text-danger'>{error}</div>) || (warning && <div className='text-danger'>{warning}</div>)}
      </FormGroup>
    )
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

  renderDatePicker({ input, defaultValue, label, type, disabled, rows = 4, meta: { touched, error, warning } }) {
    return (
      <FormGroup>
        <label>{label}</label>
        <Datetime {...input} utc={true} value={input.value ? moment.utc(input.value).format(dateFormat + " " + timeFormat) : defaultValue} dateFormat={dateFormat} timeFormat={timeFormat} selected={input.value ? moment.utc(input.value, dateFormat + " " + timeFormat) : null } inputProps={ { disabled: disabled}}/>
        {touched && ((error && <div className='text-danger'>{error}</div>) || (warning && <div className='text-danger'>{warning}</div>))}
      </FormGroup>
    )
  }


  renderEventOptions() {

    const {eventTemplate} = this.props;
    const {event_options} = eventTemplate;

    return ( event_options.map((option, index) => {

      if (option.event_option_type == 'dropdown') {

        let defaultOption = ( <option key={`${option.event_option_name}.empty_value`}></option> );

        let optionList = option.event_option_values.map((option_value, index) => {
          return (
            <option key={`${option.event_option_name}.${index}`} value={`${option_value}`}>{ `${option_value}`}</option>
          );
        });

        return (
          <div key={`option_${index}`}>
            <Field
              name={`option_${index}`}
              type="select"
              component={this.renderSelectField}
              label={option.event_option_name}
              required={(option.event_option_required)? true : false }
              validate={ value => value || !option.event_option_required ? undefined : 'Required' }
            >
              { defaultOption }
              { optionList }
            </Field>
          </div>
        )
      } else if (option.event_option_type == 'text') {
        return (
          <div key={`option_${index}`}>
            <Field
              name={`option_${index}`}
              type="text"
              component={this.renderTextField}
              label={option.event_option_name}
              required={(option.event_option_required)? true : false }
              validate={ value => value || !option.event_option_required ? undefined : 'Required' }
            />
          </div>
        )
      }
    }));
  }

  render() {
    const { show, handleHide, handleSubmit, eventTemplate, pristine, submitting, valid } = this.props

    return (
      <Modal show={show} onHide={handleHide}>
        <form onSubmit={ handleSubmit(this.handleFormSubmit.bind(this)) }>
          <Modal.Header closeButton>
            <Modal.Title>Add/Update Comment</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Field
              name="event_comment"
              component={this.renderTextArea}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button bsStyle="default" bsSize="small" type="button" disabled={submitting} onClick={handleHide}>Cancel</Button>
            <Button bsStyle="primary" bsSize="small" type="submit" disabled={ submitting || !valid}>Submit</Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}

function validate(formProps) {
  const errors = {};
  return errors;

}

EventCommentModal = reduxForm({
  form: 'EventCommentModal',
  enableReinitialize: true,
})(EventCommentModal);

function mapStateToProps(state, ownProps) {

  let event_option_comment = ownProps.event.event_options.find(event_option => event_option.event_option_name == 'event_comment')
  if(event_option_comment) {
    return {
      initialValues: { event_comment: event_option_comment.event_option_value }
    }
  }

  return {}
}

EventCommentModal = connect(
  mapStateToProps, actions
)(EventCommentModal)

export default connectModal({ name: 'eventComment', destroyOnHide: true })(EventCommentModal)