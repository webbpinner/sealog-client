import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, initialize, formValueSelector } from 'redux-form';
import { Alert, Button, Checkbox, Col, FormGroup, FormControl, FormGroupItem, Grid, Panel, Row } from 'react-bootstrap';
import * as actions from '../actions';

const trueFalseOptions = { value: true, label: 'True' };

class EventFilterForm extends Component {

  constructor (props) {
    super(props);

//    this.renderDataSourceFilter = this.renderDataSourceFilter.bind(this);
  }

  componentWillUnmount() {
//    this.props.leaveCreateExportTemplateForm();
  }

  handleFormSubmit(formProps) {
    let filterParams = {}

    if(formProps.value){
      filterParams.value = formProps.value.split(',');
    }

    if(formProps.freetext){
      filterParams.freetext = formProps.freetext;
    }

    if(formProps.user){
      filterParams.user = formProps.user.split(',');
    }

    if(formProps.limit){
      filterParams.limit = formProps.limit.split(',');
    }

    if(formProps.offset){
      filterParams.offset = formProps.offset.split(',');
    }

    if(formProps.startTS){
      filterParams.startTS = formProps.startTS;
    }

    if(formProps.stopTS){
      filterParams.stopTS = formProps.stopTS;
    }

    this.props.fetchFilteredEvents(filterParams);
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

  renderCheckbox({ input, name, label, type, meta: { touched, error, warning } }) {
    return (
      <FormGroup>
          <Checkbox
            name={name}
            inline={true}
            checked={input.value}
            onChange={event => {
              if(event.target.checked) {
                newValue.push(option.value);
              } else {
                newValue.splice(newValue.indexOf(option.value), 1);
              }
              return input.onChange(newValue);
            }}
          >
            <label>{label}</label>
          </Checkbox>
        {touched && ((error && <div className='text-danger'>{error}</div>) || (warning && <div className='text-danger'>{warning}</div>))}
      </FormGroup>
    )
  }

  renderCheckboxGroup({ label, required, name, options, input, meta: { dirty, error, warning } }) {    

    let checkboxList = options.map((option, index) => {
      return (
        <Checkbox
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
          { option.label }
        </Checkbox>
      );
    });

    return (
      <FormGroup>
        <label>{label}</label>
        {checkboxList}
        {dirty && ((error && <div className='text-danger'>{error}</div>) || (warning && <div className='text-danger'>{warning}</div>))}
      </FormGroup>
    );
  }

  renderDataSourceFilter() {
    if (this.props.showDataSourceFilter) {
      return (
        <Field
          name="datasource"
          type="text"
          component={this.renderField}
          label="Data Source Filter"
        />
      )
    }
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
    const formHeader = (<h3>Event Filter</h3>);

    if (this.props.roles && (this.props.roles.includes("admin") || this.props.roles.includes("event_manager") || this.props.roles.includes("event_logger") || this.props.roles.includes("event_watcher"))) {
      return (
        <Panel bsStyle="default" header={formHeader}>
          <form onSubmit={ handleSubmit(this.handleFormSubmit.bind(this)) }>
            <Field
              name="value"
              type="text"
              component={this.renderField}
              label="Event Filter"
            />
            <Field
              name="freetext"
              component={this.renderField}
              type="text"
              label="Free text Filter"
            />
            <Field
              name="user"
              component={this.renderField}
              type="text"
              label="User Filter"
            />
            <Field
              name="startTS"
              component={this.renderField}
              type="text"
              label="Start Time"
            />
            <Field
              name="stopTS"
              component={this.renderField}
              type="text"
              label="Stop Time"
            />
            <Field
              name="limit"
              component={this.renderField}
              type="text"
              label="Limit"
            />
            <Field
              name="offset"
              component={this.renderField}
              type="text"
              label="Offset"
            />
            {this.renderAlert()}
            {this.renderMessage()}
            <div className="pull-right">
              <Button bsStyle="default" type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</Button>
              <Button bsStyle="primary" type="submit" disabled={submitting || !valid}>Apply Filter</Button>
            </div>
          </form>
        </Panel>
      )
    } else {
      return (
        <div>
          Loading...
        </div>
      )
    }
  }
}

function validate(formProps) {
  const errors = {};

  if (formProps.startTS && !/(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})\.(\d{3})Z/i.test(formProps.startTS)) {
    errors.startTS = 'Invalid Date Format (YYYY-MM-DDThh:mm:ss.SSSZ)'
  }

  if (formProps.event_export_template_stopTS && !/(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})\.(\d{3})Z/i.test(formProps.stopTS)) {
    errors.event_export_template_stopTS = 'Invalid Date Format (YYYY-MM-DDThh:mm:ss.SSSZ)'
  }

  if (!isNaN(+formProps.limit) && +formProps.limit <= 0) {
    errors.event_export_template_limit = 'Limit must be an integer 0 or greater'
  }

  if (!isNaN(+formProps.offset) && +formProps.offset <= 0) {
    errors.offset = 'Offset must be an integer 0 or greater'
  }

  //console.log(errors);
  return errors;

}

function mapStateToProps(state) {

  return {
    errorMessage: state.event.event_error,
    message: state.event.event_message,
    roles: state.user.profile.roles,
    initialValues: { 
    },
    showDataSourceFilter: selector(state, 'event_export_template_include_aux_data')
  };

}

EventFilterForm = reduxForm({
  form: 'eventFilterForm',
  enableReinitialize: true,
  validate: validate
})(EventFilterForm);

const selector = formValueSelector('eventFilterForm');

export default connect(mapStateToProps, actions)(EventFilterForm);
