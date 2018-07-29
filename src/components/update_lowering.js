import moment from 'moment';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, initialize } from 'redux-form';
import { Alert, Button, Checkbox, Col, FormGroup, FormControl, FormGroupItem, Grid, Panel, Row, Tooltip, OverlayTrigger} from 'react-bootstrap';
import * as actions from '../actions';

const dateFormat = "YYYY-MM-DD"
const timeFormat = "HH:mm"

class UpdateLowering extends Component {

  componentWillMount() {
    this.props.initLowering(this.props.id);
  }

  componentWillUnmount() {
    this.props.leaveUpdateLoweringForm();
  }

  handleFormSubmit(formProps) {
    formProps.lowering_observers = (formProps.lowering_observers)? formProps.lowering_observers.split(',').map(observer => observer.trim()): [];
    this.props.updateLowering(formProps);
  }

  renderField({ input, label, type, placeholder, required, meta: { touched, error, warning } }) {
    let requiredField = (required)? <span className='text-danger'> *</span> : ''
    return (
      <FormGroup>
        <label>{label}{requiredField}</label>
        <FormControl {...input} placeholder={placeholder} type={type}/>
        {touched && (error && <div className='text-danger'>{error}</div>) || (warning && <div className='text-danger'>{warning}</div>)}
      </FormGroup>
    )
  }

  renderTextArea({ input, label, type, placeholder, required, rows = 4, meta: { touched, error, warning } }) {
    let requiredField = (required)? <span className='text-danger'> *</span> : ''
    let placeholder_txt = (placeholder)? placeholder: label
    return (
      <FormGroup>
        <label>{label}{requiredField}</label>
        <FormControl {...input} placeholder={placeholder_txt} componentClass={type} rows={rows}/>
        {touched && ((error && <div className='text-danger'>{error}</div>) || (warning && <div className='text-danger'>{warning}</div>))}
      </FormGroup>
    )
  }

  renderDatePicker({ input, label, type, required, meta: { touched, error, warning } }) {
    let requiredField = (required)? <span className='text-danger'> *</span> : ''
    return (
      <FormGroup>
        <label>{label}{requiredField}</label>
        <Datetime {...input} utc={true} value={input.value ? moment.utc(input.value).format(dateFormat + " " + timeFormat) : null} dateFormat={dateFormat} timeFormat={timeFormat} selected={input.value ? moment.utc(input.value, dateFormat + " " + timeFormat) : null }/>
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

  renderAdminOptions() {
    if(this.props.roles.includes('admin')) {
      return (
        <div>
          <label>Additional Options:</label>
          {this.renderSystemLoweringOption()}
        </div>
      )
    }
  }

  renderSystemLoweringOption() {
    return (
      <Field
        name="system_user"
        label="System Lowering?"
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
    const updateLoweringFormHeader = (<div>Update Dive Metadata</div>);


    if (this.props.roles && (this.props.roles.includes("admin") || this.props.roles.includes('cruise_manager'))) {

      return (
        <Panel bsStyle="default" header={updateLoweringFormHeader}>
          <form onSubmit={ handleSubmit(this.handleFormSubmit.bind(this)) }>
              <Field
                name="lowering_id"
                component={this.renderField}
                type="text"
                label="Dive Number"
                placeholder="i.e. 4023"
              />
              <Field
                name="lowering_description"
                component={this.renderTextArea}
                type="textarea"
                label="Dive Summary"
                placeholder="A concise summary of the dive"
                rows={10}
              />
              <Field
                name="lowering_location"
                type="text"
                component={this.renderField}
                label="Dive Location"
                placeholder="i.e. Kelvin Seamount"
              />
              <Field
                name="lowering_pilot"
                component={this.renderField}
                type="text"
                label="Pilot"
                placeholder="i.e. Bruce Strickrott"
              />
              <Field
                name="lowering_observers"
                component={this.renderField}
                type="text"
                label="Observers (comma delimited)"
                placeholder="i.e. Adam Soule,Masako Tominaga"
              />
            {this.renderAlert()}
            {this.renderMessage()}
            <div className="pull-right">
              <Button bsStyle="default" type="button" disabled={pristine || submitting} onClick={reset}>Reset Values</Button>
              <Button bsStyle="primary" type="submit" disabled={pristine || submitting || !valid}>Update</Button>
            </div>
          </form>
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
  return errors;
}

function mapStateToProps(state) {

  return {
    errorMessage: state.lowering.lowering_error,
    message: state.lowering.lowering_message,
    initialValues: state.lowering.lowering,
    roles: state.user.profile.roles
  };

}

UpdateLowering = reduxForm({
  form: 'editLowering',
  enableReinitialize: true,
  validate: validate
})(UpdateLowering);

export default connect(mapStateToProps, actions)(UpdateLowering);