import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, FieldArray, initialize, formValueSelector } from 'redux-form';
import { Alert, Button, Checkbox, Col, ControlLabel, FormGroup, FormControl, FormGroupItem, Grid, Panel, Row } from 'react-bootstrap';
import * as actions from '../actions';
import { EventTemplateOptionTypes } from '../event_template_option_types';


class CreateEventTemplate extends Component {

  constructor (props) {
    super(props);

    this.renderOptions = this.renderOptions.bind(this);
    this.renderOptionsDropdown = this.renderOptionsDropdown.bind(this);
  }

  componentWillUnmount() {
    this.props.leaveCreateEventTemplateForm();
  }

  handleFormSubmit(formProps) {
    //console.log(formProps);
    this.props.createEventTemplate(formProps);
  }

  renderField({ input, label, type, meta: { touched, error, warning } }) {
    return (
      <FormGroup>
        <label>{label}</label>
        <FormControl {...input} placeholder={label} type={type}/>
        {(error && <div className='text-danger'>{error}</div>) || (warning && <div className='text-danger'>{warning}</div>)}
      </FormGroup>
    )
  }

  renderSelectField({ input, label, type, options, meta: { touched, error, warning } }) {

    let defaultOption = ( <option key={`${input.name}.default`} value=""></option> );

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

//  { fields, meta: { touched, error } }

  renderOptionsDropdown(prefix, index) {
    //console.log(this.props.event_options[index]);

    if(this.props.event_options[index].event_option_type == 'dropdown') {
      return (
        <ul>
          <li>
            <Field
              name={`${prefix}.event_option_values`}
              type="text"
              component={this.renderField}
              label="Dropdown Options"
            />
            <Field
              name={`${prefix}.event_option_default_value`}
              type="text"
              component={this.renderField}
              label="Default Value"/>
          </li>
        </ul>
      );
    } else {
      return;
    }
  }

  renderOptions({ fields, meta: { touched, error } }) {
    return (
      <div>
        <ul>
          {fields.map((options, index) =>
            <li key={index}>
              <span>
                <label>Option #{index + 1}</label>
                <div className="pull-right">
                  <Button bsStyle="danger" bsSize="xs" type="button" onClick={() => fields.remove(index)}>Remove</Button>
                </div>
              </span>
              <Field
                name={`${options}.event_option_name`}
                type="text"
                component={this.renderField}
                label="Name"/>
              <Field
                name={`${options}.event_option_type`}
                type="select"
                component={this.renderSelectField}
                options={EventTemplateOptionTypes}
                label="Type"
              />
              { this.renderOptionsDropdown(options, index) }
              <div>
                <label>Required?</label>
                <span>&nbsp;&nbsp;</span>
                <Field
                  name={`${options}.event_option_required`}
                  id={`${options}.event_option_required`}
                  component="input"
                  type="checkbox"
                />
              </div>
            </li>
          )}
        </ul>
        <Button bsStyle="primary" bsSize="xs" type="button" onClick={() => fields.push({})}>Add Option</Button>
        {touched && error && <span>{error}</span>}
      </div>
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
    const formHeader = (<h3>Event Definition Profile</h3>);


    if (this.props.roles && (this.props.roles.includes("admin") || this.props.roles.includes("event_manager"))) {
      return (
        <Grid fluid>
          <Row>
            <Col sm={8} smOffset={2} md={6} mdOffset={3} lg={4} lgOffset={4}>
              <Panel bsStyle="default" header={formHeader}>
                <form onSubmit={ handleSubmit(this.handleFormSubmit.bind(this)) }>
                  <Field
                    name="event_name"
                    component={this.renderField}
                    type="text"
                    label="Name"
                  />
                  <Field
                    name="event_value"
                    type="text"
                    component={this.renderField}
                    label="Event Value"
                  />
                  <div>
                    <label>Free text Required?</label>
                    <span>&nbsp;&nbsp;</span>
                    <Field
                      name='event_free_text_required'
                      id='event_free_text_required'
                      component="input"
                      type="checkbox"
                    />
                  </div>

                  <FieldArray name="event_options" component={this.renderOptions}/>
                  <br/>
                  {this.renderAlert()}
                  {this.renderMessage()}
                  <div className="pull-right">
                    <Button bsStyle="default" type="button" bsSize="small" disabled={pristine || submitting} onClick={reset}>Reset Values</Button>
                    <Button bsStyle="primary" type="submit" bsSize="small" disabled={pristine || submitting || !valid}>Create</Button>
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

  if (!formProps.event_name) {
    errors.event_name = 'Required'
  } else if (formProps.event_name.length > 15) {
    errors.event_name = 'Must be 15 characters or less'
  }

  if (!formProps.event_value) {
    errors.event_value = 'Required'
  }

  // if (!formProps.event_options || !formProps.event_options.length) {
  //   errors.event_options = { _error: 'There must be at least one option' }
  // } else {

  if (formProps.event_options && formProps.event_options.length) {
    const event_optionsArrayErrors = []
    formProps.event_options.forEach((event_option, event_optionIndex) => {
      const event_optionErrors = {}
      if (!event_option || !event_option.event_option_name) {
        event_optionErrors.event_option_name = 'Required'
        event_optionsArrayErrors[event_optionIndex] = event_optionErrors
      }
      if (!event_option || !event_option.event_option_type) {
        event_optionErrors.event_option_type = 'Required'
        event_optionsArrayErrors[event_optionIndex] = event_optionErrors
      } else {
        if (event_option.event_option_type == 'dropdown') {

          let valueArray = [];

          try {
            valueArray = event_option.event_option_values.split(',');
            valueArray = valueArray.map(string => {
              return string.trim()
            })
          }
          catch(err) {
            event_optionErrors.event_option_values = 'Invalid csv list'
            event_optionsArrayErrors[event_optionIndex] = event_optionErrors
          }

          if(event_option.event_option_default_value && !valueArray.includes(event_option.event_option_default_value)) {
            event_optionErrors.event_option_default_value = 'Value is not in options list'
            event_optionsArrayErrors[event_optionIndex] = event_optionErrors
          }
        }
      }
      // if (option && option.hobbies && option.hobbies.length) {
      //   const hobbyArrayErrors = []
      //   option.hobbies.forEach((hobby, hobbyIndex) => {
      //     if (!hobby || !hobby.length) {
      //       hobbyArrayErrors[hobbyIndex] =  'Required'
      //     }
      //   })
      //   if(hobbyArrayErrors.length) {
      //     optionErrors.hobbies = hobbyArrayErrors
      //     optionsArrayErrors[optionIndex] = optionErrors
      //   }
      //   if (option.hobbies.length > 5) {
      //     if(!optionErrors.hobbies) {
      //       optionErrors.hobbies = []
      //     }
      //     optionErrors.hobbies._error = 'No more than five hobbies allowed'
      //     optionsArrayErrors[optionIndex] = optionErrors
      //   }
      // }
    })
    if(event_optionsArrayErrors.length) {
      errors.event_options = event_optionsArrayErrors
    }
  }

  //console.log(errors);
  return errors;

}

function mapStateToProps(state) {

  return {
    errorMessage: state.event_template.event_template_error,
    message: state.event_template.event_template_message,
    roles: state.user.profile.roles,
    event_options: selector(state, 'event_options')
  };

}

CreateEventTemplate = reduxForm({
  form: 'createEventTemplate',
  enableReinitialize: true,
  validate: validate
})(CreateEventTemplate);

const selector = formValueSelector('createEventTemplate');

export default connect(mapStateToProps, actions)(CreateEventTemplate);