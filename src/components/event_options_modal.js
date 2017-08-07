import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, ControlLabel, FormGroup, FormControl, FormGroupItem, Modal } from 'react-bootstrap';
import { connectModal } from 'redux-modal';
import { reduxForm, Field, initialize, formValueSelector } from 'redux-form';

class EventOptionsModal extends Component {

  constructor (props) {
    super(props);

//    this.handleConfirm = this.handleConfirm.bind(this);
  }

  static propTypes = {
    eventDefinition: PropTypes.object.isRequired,
    handleHide: PropTypes.func.isRequired,
    handleCreateEvent: PropTypes.func.isRequired
  };

  handleFormSubmit(formProps) {

    //console.log(formProps);

    let temp = JSON.parse(JSON.stringify(formProps));;

    delete temp.event_free_text
    //console.log(temp);

    let list = Object.keys(temp).map( (k) => {return temp[k]})
    let event_options = list.map(x => { return ({ event_option_name: this.props.eventDefinition.event_options[list.indexOf(x)].event_option_name, event_option_value: x})});

    //console.log(list);
    //console.log(event_options);

    //console.log( {event_value: this.props.eventDefinition.event_value, event_free_text: formProps.event_free_text, event_options: event_options});
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

  renderSelectField({ input, label, defaultValue, type, options, meta: { touched, error, warning } }) {

    input.value = defaultValue;

    let defaultOption = ( <option key={`${input.name}.event_option_default_value`} value=""></option> );

    let optionList = options.map((option, index) => {
      return (
        <option key={`${input.name}.${index}`} value={`${option}`}>{ `${option}`}</option>
      );
    });

    return (
      <FormGroup controlId="formControlsSelect">
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...input} componentClass={type} placeholder={label}>
          { defaultOption }
          { optionList }
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
        return (
          <div key={`option_${index}`}>
            <Field
              name={`option_${index}`}
              type="select"
              component={this.renderSelectField}
              options={option.event_option_values}
              defaultValue={option.event_option_default_value}
              label={option.event_option_name}
              validate={ value => value || !option.event_option_required ? undefined : 'Required' }
            />
          </div>
        )
      } else if (option.event_option_type == 'text') {
        return (
          <div key={`option_${index}`}>
            <Field
              name={`option_${index}`}
              type="select"
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

    //console.log(eventDefinition);

    return (
      <Modal show={show}>
        <form onSubmit={ handleSubmit(this.handleFormSubmit.bind(this)) }>
          <Modal.Header>
            <Modal.Title>Event Options</Modal.Title>
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
            <Button bsStyle="default" type="button" disabled={submitting} onClick={handleHide}>Cancel</Button>
            <Button bsStyle="primary" type="submit" disabled={ submitting || !valid}>Submit</Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}

function validate(formProps) {
  const errors = {};

//  console.log(this.props);

//  if (this.props.eventDefinition.event_free_text_required && !formProps.event_free_text) {
//    errors.event_free_text = 'Required'
//  }

  return errors;

}

EventOptionsModal = reduxForm({
  form: 'eventOptionsModal',
  enableReinitialize: true,
  validate: validate
})(EventOptionsModal);


export default connectModal({ name: 'eventOptions' })(EventOptionsModal)