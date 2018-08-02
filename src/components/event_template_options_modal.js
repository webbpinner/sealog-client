import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, ControlLabel, FormGroup, FormControl, FormGroupItem, Modal } from 'react-bootstrap';
import { connectModal } from 'redux-modal';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import moment from 'moment';
import { reduxForm, Field, initialize, formValueSelector } from 'redux-form';

const dateFormat = "YYYY-MM-DD"
const timeFormat = "HH:mm:ss"

class EventTemplateOptionsModal extends Component {

  constructor (props) {
    super(props);

    // this.state = {
    //   defaultValues: {}
    // }

    this.renderDatePicker = this.renderDatePicker.bind(this);

//    this.handleConfirm = this.handleConfirm.bind(this);
  }

  static propTypes = {
    eventTemplate: PropTypes.object.isRequired,
    handleHide: PropTypes.func.isRequired,
    handleCreateEvent: PropTypes.func.isRequired
  };

  componentWillMount() {
    // this.setState = {defaultValues: this.populateDefaultValues()};
  }

  populateDefaultValues() {
    let eventDefaultValues = {};
    let hack = this.props.eventTemplate.event_options.map( (option, index) => {
      if(option.event_option_default_value) {
        eventDefaultValues[`option_${index}`] = option.event_option_default_value;
      }
      return;

    });

    this.props.initialize(eventDefaultValues);
  }

  handleFormSubmit(formProps) {

    let temp = JSON.parse(JSON.stringify(formProps));

    delete temp.event_free_text
    delete temp.event_ts

    console.log("temp:", temp)
   
    //Convert obecjts to arrays
    let optionValue = []
    let optionIndex = Object.keys(temp).sort().map( (value, index) => { optionValue.push(temp[value]); return parseInt(value.split('_')[1])});

    //Remove empty fields
    optionValue.map( (value, index) => { if(value == "") { console.log("Index", index, "empty"); optionIndex.splice(index, 1); optionValue.splice(index, 1); } });

    //Build event_options array
    let event_options = optionIndex.map( (value, index) => { return ({ event_option_name: this.props.eventTemplate.event_options[value].event_option_name, event_option_value: optionValue[index]}) });

    let event_ts = (formProps.event_ts)? formProps.event_ts.toISOString() : '';

    //Submit event
    this.props.handleCreateEvent(this.props.eventTemplate.event_value, formProps.event_free_text, event_options, event_ts);
    this.props.handleDestroy();
  }

  renderTextField({ input, label, type, required, meta: { touched, error, warning } }) {
    let requiredField = (required)? <span className='text-danger'> *</span> : ''
    return (
      <FormGroup>
        <label>{label}{requiredField}</label>
        <FormControl {...input} placeholder={label} type={type}/>
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
            <Modal.Title>Event Options - {eventTemplate.event_value}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {this.renderEventOptions()}
            <Field
              name="event_free_text"
              component={this.renderTextField}
              type="text"
              label="Additional Text"
              validate={ value => value || !eventTemplate.event_free_text_required ? undefined : 'Required' }
            />
            <Field
              name="event_ts"
              label="Custom Time (UTC)"
              component={this.renderDatePicker}
              type="text"
              disabled={this.props.disabled}
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

//  if (this.props.eventTemplate.event_free_text_required && !formProps.event_free_text) {
//    errors.event_free_text = 'Required'
//  }

  return errors;

}

EventTemplateOptionsModal = reduxForm({
  form: 'eventTemplateOptionsModal'//,
  //enableReinitialize: true//,
  //validate: validate
})(EventTemplateOptionsModal);

//this.defaultValues
// function mapStateToProps(state, ownProps) {
//     return {
//         use_custom_time: selector(state, "use_custom_time")
//     };
// }


export default connectModal({ name: 'eventOptions' })(EventTemplateOptionsModal)