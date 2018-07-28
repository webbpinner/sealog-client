import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, ControlLabel, FormGroup, FormControl, FormGroupItem, Modal } from 'react-bootstrap';
import { connectModal } from 'redux-modal';
import { reduxForm, Field, initialize, formValueSelector } from 'redux-form';

class EventOptionsModal extends Component {

  constructor (props) {
    super(props);

    this.defaultValues = {}
//    this.handleConfirm = this.handleConfirm.bind(this);
  }

  static propTypes = {
    eventDefinition: PropTypes.object.isRequired,
    handleHide: PropTypes.func.isRequired,
    handleCreateEvent: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.defaultValues = this.populateDefaultValues();
  }

  populateDefaultValues() {
    let eventDefaultValues = {};
    let hack = this.props.eventDefinition.event_options.map( (option, index) => {
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
   
    //Convert obecjts to arrays
    let optionValue = []
    let optionIndex = Object.keys(temp).sort().map( (value, index) => { optionValue.push(temp[value]); return parseInt(value.split('_')[1])});

    //Remove empty fields
    optionValue.map( (value, index) => { if(value == "") { console.log("Index", index, "empty"); optionIndex.splice(index, 1); optionValue.splice(index, 1); } });

    //Build event_options array
    let event_options = optionIndex.map( (value, index) => { return ({ event_option_name: this.props.eventDefinition.event_options[value].event_option_name, event_option_value: optionValue[index]}) });

    //Submit event
    this.props.handleCreateEvent(this.props.eventDefinition.event_value, formProps.event_free_text, event_options);
    this.props.handleDestroy();
  }

  renderTextField({ input, label, type, meta: { touched, error, warning } }) {
    return (
      <FormGroup>
        <label>{label}</label>
        <FormControl {...input} placeholder={label} type={type}/>
        {(error && <div className='text-danger'>{error}</div>) || (warning && <div className='text-danger'>{warning}</div>)}
      </FormGroup>
    )
  }

  renderSelectField({children, input, label, type, meta: { touched, error, warning } }) {

    return (
      <FormGroup controlId="formControlsSelect">
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...input} componentClass={type} placeholder={label}>
          {children}
        </FormControl>
        {(error && <div className='text-danger'>{error}</div>) || (warning && <div className='text-danger'>{warning}</div>)}
      </FormGroup>
    )
  }

  renderEventOptions() {

    const {eventDefinition} = this.props;
    const {event_options} = eventDefinition;

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
              validate={ value => value || !option.event_option_required ? undefined : 'Required' }
            />
          </div>
        )
      }
    }));
  }

  render() {

    const { show, handleHide, handleSubmit, eventDefinition, pristine, submitting, valid } = this.props

    console.log(eventDefinition.event_value)

    return (
      <Modal show={show} onHide={handleHide}>
        <form onSubmit={ handleSubmit(this.handleFormSubmit.bind(this)) }>
          <Modal.Header closeButton>
            <Modal.Title>Event Options - {eventDefinition.event_value}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {this.renderEventOptions()}
            <Field
              name="event_free_text"
              component={this.renderTextField}
              type="text"
              label="Additional Text"
              validate={ value => value || !eventDefinition.event_free_text_required ? undefined : 'Required' }
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

//  if (this.props.eventDefinition.event_free_text_required && !formProps.event_free_text) {
//    errors.event_free_text = 'Required'
//  }

  return errors;

}

EventOptionsModal = reduxForm({
  form: 'eventOptionsModal'//,
  //enableReinitialize: true//,
  //validate: validate
})(EventOptionsModal);

//this.defaultValues


export default connectModal({ name: 'eventOptions' })(EventOptionsModal)