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

//    this.handleConfirm = this.handleConfirm.bind(this);
  }

  static propTypes = {
    id: PropTypes.string.isRequired };

  componentWillMount() {

    this.props.fetchSelectedEvent(this.props.id)
  }

  componentWillUnmount() {
//    this.props.clearSelectedEvent();
  }

  handleFormSubmit({event_comment = ''}) {

    let payload = {
      event_options: [
        {
          event_option_name: 'event_comment',
          event_option_value: event_comment
        }
      ]
    }
    axios.patch(`${API_ROOT_URL}/api/v1/events/${this.props.id}`,
      payload,
      {
        headers: {
        authorization: cookies.get('token')
        }
      }      
    )
    // .then((response) => {

    //   dispatch(fetchCustomVars());
    // })
    .catch((error) => {
      console.log(error);
    });

    this.props.handleHide();
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

function mapStateToProps(state) {

  if (state.event.selected_event.event_options) {
    let options = {}
    state.event.selected_event.event_options.forEach((option) => {
      options[option.event_option_name] = option.event_option_value
    })
    return {
      initialValues: options
    }
  } else {
    return {
     initialValues: {}
    }
  }

}

EventCommentModal = connect(
  mapStateToProps, actions
)(EventCommentModal)

export default connectModal({ name: 'eventComment', destroyOnHide: true })(EventCommentModal)