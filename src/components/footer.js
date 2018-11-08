import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import * as actions from '../actions';

class Footer extends Component {

  constructor (props) {
    super(props);

    this.state = {
      intervalID: null
    }

    this.handleASNAPNotification = this.handleASNAPNotification.bind(this);
  }

  componentWillMount() {
  }

  componentDidMount() {
    let intervalId = setInterval(this.handleASNAPNotification, 5000);
    this.setState({intervalId: intervalId})
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  handleASNAPNotification() {
    if(this.props.authenticated) {
      this.props.fetchCustomVars()
    }
  }

  render () {

    let asnapStatus = null

    if(this.props.authenticated && this.props.asnapStatus && this.props.asnapStatus == "Off") {
      asnapStatus =  (
        <span>
          ASNAP: <span className="text-danger">Off</span>
        </span>
      )
    } else if(this.props.authenticated && this.props.asnapStatus && this.props.asnapStatus == "On") {
      asnapStatus =  (
        <span>
          ASNAP: <span className="text-success">On</span>
        </span>
      )
    } else if(this.props.authenticated) {
      asnapStatus =  (
        <span>
          ASNAP: <span className="text-warning">Unknown</span>
        </span>
      )
    }

    return (
      <Row>
        <hr/>
        <Col xs={12}>
          {asnapStatus}
          <span className="pull-right">
            <a href={`/github`} target="_blank">Sealog</a> is licensed under the <a href={`/license`} target="_blank">GPLv3</a> public license
          </span>
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state){

  let asnapStatus = (state.custom_var)? state.custom_var.custom_vars.filter(custom_var => custom_var.custom_var_name == "asnapStatus") : []

  return {
    asnapStatus: (asnapStatus.length > 0)? asnapStatus[0].custom_var_value : "Unknown",
    authenticated: state.auth.authenticated,

  }
}

export default connect(mapStateToProps, actions)(Footer);
