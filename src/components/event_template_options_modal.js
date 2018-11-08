import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Button, Checkbox, ControlLabel, FormGroup, FormControl, FormGroupItem, Modal } from 'react-bootstrap';
import { connectModal } from 'redux-modal';
import Datetime from 'react-datetime';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import { reduxForm, Field, initialize, formValueSelector } from 'redux-form';
import Cookies from 'universal-cookie';
import { API_ROOT_URL } from '../url_config';

const dateFormat = "YYYY-MM-DD"
const timeFormat = "HH:mm:ss.SSS"

const TIMER_INTERVAL = 1000
const TIMEOUT = 120 //seconds
const cookies = new Cookies();

const required =  value => !value ? 'Required' : undefined

const requiredArray =  value => !value || value.length === 0 ? 'At least one required' : undefined


class EventTemplateOptionsModal extends Component {

  constructor (props) {
    super(props);

    this.state = {
      ts: "",
      current_time: moment(),
      expire_time: moment().add(TIMEOUT, 'seconds'), 
      timer: null
    }

    this.renderDatePicker = this.renderDatePicker.bind(this);
    this.updateElapseTime = this.updateElapseTime.bind(this);

//    this.handleConfirm = this.handleConfirm.bind(this);
  }

  static propTypes = {
    eventTemplate: PropTypes.object.isRequired,
    handleHide: PropTypes.func.isRequired,
    handleCreateEvent: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.getServerTime();
    // console.log("Start Timer")
    this.setState({timer:setInterval(this.updateElapseTime, TIMER_INTERVAL)});
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
    this.setState({timer: null })
  }

  updateElapseTime() {
    if(this.state.timer && this.state.current_time.isAfter(this.state.expire_time)) {
      // console.log("Stop Timer")
      clearInterval(this.state.timer);
      this.setState({timer: null })
    } else {
      this.setState({current_time: moment()})
    }
  }

  async getServerTime() {
    await axios.get(`${API_ROOT_URL}/server_time`,
    {
      headers: {
        authorization: cookies.get('token'),
        'content-type': 'application/json'
      }
    })
    .then((response) => {
      // console.log(response.data)
      this.setState({ts: moment(response.data.ts).toISOString()});
      this.setState({expire_time: moment(response.data.ts).add(TIMEOUT, 'seconds')});
      // console.log("ts:",this.state.ts)
    })
    .catch((err) => {
      console.log(err);
    })
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

    //Convert obecjts to arrays
    let optionValue = []
    let optionIndex = Object.keys(temp).sort().map( (value, index) => { optionValue.push(temp[value]); return parseInt(value.split('_')[1])});

    //Remove empty fields
    optionValue.map( (value, index) => { if(value == "") { console.log("Index", index, "empty"); optionIndex.splice(index, 1); optionValue.splice(index, 1); } });

    //Build event_options array
    let event_options = optionIndex.map( (value, index) => {
      // console.log(typeof(optionValue[index]));
      // console.log(optionValue[index])
      // console.log(optionValue[index].constructor === Array)

      if(optionValue[index].constructor === Array) {
        optionValue[index] = optionValue[index].join(';')
      }

      return (
        { event_option_name: this.props.eventTemplate.event_options[value].event_option_name,
          event_option_value: optionValue[index]
        }
      )
    });

    // console.log("formProps.event_ts:", formProps.event_ts)
    let event_ts = (formProps.event_ts)? formProps.event_ts.toISOString() : '';
    // console.log("event_ts:", event_ts)

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

  renderCheckboxGroup({ label, name, options, input, required, meta: { dirty, error, warning } }) {

    let requiredField = (required)? (<span className='text-danger'> *</span>) : ''
    let checkboxList = options.map((option, index) => {

      //let tooltip = (option.description)? (<Tooltip id={`${option.value}_Tooltip`}>{option.description}</Tooltip>) : null
      //let overlay = (tooltip != null)? (<OverlayTrigger placement="right" overlay={tooltip}><span>{option.label}</span></OverlayTrigger>) : option.label

      return (
          <Checkbox
            inline
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
            {option.value}
          </Checkbox>
      );
    });

    return (
      <FormGroup>
        <label>{label}{requiredField}</label><br/>
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

  renderDatePicker({ input, defaultValue, label, type, disabled, rows = 4, meta: { touched, error, warning } }) {
    return (
      <FormGroup>
        <label>{label}</label>
        <Datetime {...input} utc={true} value={input.value ? moment.utc(input.value).format(dateFormat + " " + timeFormat) : moment.utc(defaultValue).format(dateFormat + " " + timeFormat)} dateFormat={dateFormat} timeFormat={timeFormat} selected={input.value ? moment.utc(input.value, dateFormat + " " + timeFormat) : null } inputProps={ { disabled: disabled}}/>
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
              required={ option.event_option_required }
              validate={ option.event_option_required ? required : undefined }
            >
              { defaultOption }
              { optionList }
            </Field>
          </div>
        )
      } else if (option.event_option_type == 'checkboxes') {

        let defaultOption = ( <option key={`${option.event_option_name}.empty_value`}></option> );

        let optionList = option.event_option_values.map((option_value, index) => {
          return { value: option_value, label: option_value }
        });

        // console.log(optionList);

        return (
          <div key={`option_${index}`}>
            <Field
              name={`option_${index}`}
              component={this.renderCheckboxGroup}
              label={option.event_option_name}
              options={optionList}
              required={ option.event_option_required }
              validate={ option.event_option_required ? requiredArray : undefined }
            />
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
              required={ option.event_option_required }
              validate={ option.event_option_required ? required : undefined }
            />
          </div>
        )
      }
    }));
  }

  render() {

    let TimerStr = (this.state.timer && this.state.current_time.isBefore(this.state.expire_time))? <span className="pull-right">Timer:{moment.duration(this.state.expire_time.diff(this.state.current_time)).format()}</span> : <span className="pull-right text-danger">Real-time vehicle data and framegrabs will NOT be associated with this event</span>
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
              required={eventTemplate.event_free_text_required}
              validate={ eventTemplate.event_free_text_required ? required : undefined }
            />
            <Field
              name="event_ts"
              label="Custom Time (UTC)"
              component={this.renderDatePicker}
              type="text"
              disabled={this.props.disabled}
              defaultValue={this.state.ts}
            />
            <div>
              {TimerStr}
            </div>
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