import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, initialize, formValueSelector } from 'redux-form';
import { Alert, Button, Checkbox, Col, FormGroup, FormControl, FormGroupItem, Grid, Panel, Row } from 'react-bootstrap';
import * as actions from '../actions';
import { userRoleOptions } from '../user_role_options';

class UpdateEventExportTemplate extends Component {

  constructor (props) {
    super(props);

    this.renderDataSourceFilter = this.renderDataSourceFilter.bind(this);
  }

  componentWillMount() {
    //console.log(this.props.match);
    this.props.initEventExportTemplate(this.props.match.params.id);
  }

  componentWillUnmount() {
    this.props.leaveUpdateEventExportTemplateForm();
  }

  handleFormSubmit(formProps) {
    //console.log(formProps);
    this.props.updateEventExportTemplate(formProps);
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
          name="event_export_template_datasource_filter"
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
    const formHeader = (<h3>Event Export Template</h3>);


    if (this.props.roles && (this.props.roles.includes("admin") || this.props.roles.includes("event_manager") || this.props.roles.includes("event_logger") || this.props.roles.includes("event_watcher"))) {

      console.log(this.props.initialValues)
      return (
        <Grid fluid>
          <Row>
            <Col sm={8} smOffset={2} md={6} mdOffset={3} lg={4} lgOffset={4}>
              <Panel bsStyle="default" header={formHeader}>
                <form onSubmit={ handleSubmit(this.handleFormSubmit.bind(this)) }>
                  <Field
                    name="event_export_template_name"
                    component={this.renderField}
                    type="text"
                    label="Name"
                  />
                  <Field
                    name="event_export_template_eventvalue_filter"
                    type="text"
                    component={this.renderField}
                    label="Event Filter"
                  />
                  <Field
                    name="event_export_template_freetext_filter"
                    component={this.renderField}
                    type="text"
                    label="Free text Filter"
                  />
                  <Field
                    name="event_export_template_author_filter"
                    component={this.renderField}
                    type="text"
                    label="User Filter"
                  />
                  <Field
                    name="event_export_template_startTS"
                    component={this.renderField}
                    type="text"
                    label="Start Time"
                  />
                  <Field
                    name="event_export_template_stopTS"
                    component={this.renderField}
                    type="text"
                    label="Stop Time"
                  />
                  <Field
                    name="event_export_template_limit"
                    component={this.renderField}
                    type="text"
                    label="Limit"
                  />
                  <Field
                    name="event_export_template_offset"
                    component={this.renderField}
                    type="text"
                    label="Offset"
                  />
                  <div>
                    <label>Include Auxilary Data?</label>
                    <span>&nbsp;&nbsp;</span>
                    <Field
                      name="event_export_template_include_aux_data"
                      id="event_export_template_include_aux_data"
                      component="input"
                      type="checkbox"
                    />
                  </div>
                  {this.renderDataSourceFilter()}
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

  if (!formProps.event_export_template_name) {
    errors.event_export_template_name = 'Required'
  } else if (formProps.event_export_template_name.length > 15) {
    errors.event_export_template_name = 'Must be 15 characters or less'
  }

  if (formProps.event_export_template_startTS && !/(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})\.(\d{3})Z/i.test(formProps.event_export_template_startTS)) {
    errors.event_export_template_startTS = 'Invalid Date Format (YYYY-MM-DDThh:mm:ss.SSSZ)'
  }

  if (formProps.event_export_template_stopTS && !/(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})\.(\d{3})Z/i.test(formProps.event_export_template_stopTS)) {
    errors.event_export_template_stopTS = 'Invalid Date Format (YYYY-MM-DDThh:mm:ss.SSSZ)'
  }

  if (isNaN(+formProps.event_export_template_limit) || +formProps.event_export_template_limit < 0) {
    errors.event_export_template_limit = 'Limit must be an integer 0 or greater'
  }

  if (isNaN(+formProps.event_export_template_offset) || +formProps.event_export_template_offset < 0) {
    errors.event_export_template_offset = 'Offset must be an integer 0 or greater'
  }

  //console.log(errors);
  return errors;

}

function mapStateToProps(state) {

  return {
    errorMessage: state.event_export.event_export_error,
    message: state.event_export.event_export_message,
    initialValues: state.event_export.event_export,
    roles: state.user.profile.roles,
    showDataSourceFilter: selector(state, 'event_export_template_include_aux_data')
  };

}

UpdateEventExportTemplate = reduxForm({
  form: 'editEventExportTemplate',
  enableReinitialize: true,
  validate: validate
})(UpdateEventExportTemplate);

const selector = formValueSelector('editEventExportTemplate');

export default connect(mapStateToProps, actions)(UpdateEventExportTemplate);