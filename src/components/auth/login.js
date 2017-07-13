import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Grid, Row, Col, FormGroup, Panel, Button, Alert } from 'react-bootstrap';
import * as actions from '../../actions';
import { ROOT_PATH } from '../../url_config';


class Login extends Component {
 
  componentWillUnmount() {
    this.props.leaveLoginForm();
  }

  handleFormSubmit({ username, password }) {
    this.props.login({username, password});
  }

  renderAlert(){
    if(this.props.errorMessage) {
      return (
        <Alert bsStyle="danger">
          <strong>Opps!</strong> {this.props.errorMessage}
        </Alert>
      )
    } else if (this.props.successMessage) {
      return (
        <Alert bsStyle="success">
          <strong>Sweet!</strong> {this.props.successMessage}
        </Alert>
      )
    }
  }
 
  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    const loginPanelHeader = (<h3>Please Sign In</h3>);
    return (
      <Grid>
        <Row>
          <Col sm={4} smOffset={4} md={4} mdOffset={4}>
            <Panel header={loginPanelHeader}>
              <form onSubmit={ handleSubmit(this.handleFormSubmit.bind(this)) }>
                <FormGroup>
                  <Field
                    name="username"
                    component="input"
                    type="text"
                    placeholder="Username"
                    className="form-control"
                  />
                </FormGroup>
                <FormGroup>
                  <Field
                    name="password"
                    component="input"
                    type="password"
                    placeholder="Password"
                    className="form-control"
                  />
                </FormGroup>
                {this.renderAlert()}
                <div>
                  <Button bsStyle="primary" type="submit" block>Submit</Button>
                </div>
              </form>
              <br/>
              <div className="text-right">
                <Link to={ `${ROOT_PATH}/register` }>Register --></Link>
              </div>
            </Panel>
          </Col>
        </Row>
      </Grid>
    )
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    successMessage: state.auth.message
  }
}

Login = reduxForm({
  form: 'login'
})(Login);

export default connect(mapStateToProps, actions)(Login);