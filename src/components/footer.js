import React, {Component} from 'react';
//import { ThemeChooser } from 'react-bootstrap-theme-switcher';

import { connect } from 'react-redux';
import { Grid } from 'react-bootstrap';
import * as actions from '../actions';

class Footer extends Component {

  constructor (props) {
    super(props);

    this.state = {
      intervalID: null
    }
  }

  componentWillMount() {
    this.props.fetchCustomVars()
  }

  componentDidMount() {
    let intervalId = setInterval(this.props.fetchCustomVars, 5000);
    this.setState({intervalId: intervalId})
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  render () {

    const github = "https://github.com/webbpinner/sealog-client";
    const license = "http://www.gnu.org/licenses/gpl-3.0.html";

    let asnapStatus = null

    if(this.props.asnapStatus && this.props.asnapStatus == "Off") {
      asnapStatus =  (
        <span>
          ASNAP: <span className="text-danger">Off</span>
        </span>
      )
    } else if(this.props.asnapStatus && this.props.asnapStatus == "On") {
      asnapStatus =  (
        <span>
          ASNAP: <span className="text-success">On</span>
        </span>
      )
    } else if(this.props.roles) {
      asnapStatus =  (
        <span>
          ASNAP: <span className="text-warning">Unknown</span>
        </span>
      )
    }

    return (
      <Grid fluid>
        <hr/>
        <div>
          {asnapStatus}
          <span className="pull-right">
            <a href={github} target="_blank">Sealog</a> is licensed under the <a href={license} target="_blank">GPLv3</a> public license
          </span>
        </div>
      </Grid>
    );
  }
}

//        <ThemeChooser/>

function mapStateToProps(state) {

  let asnapStatus = (state.custom_var)? state.custom_var.custom_vars.filter(custom_var => custom_var.custom_var_name == "asnapStatus") : []

  return {
    asnapStatus: (asnapStatus.length > 0)? asnapStatus[0].custom_var_value : "Unknown",
    roles: state.user.profile.roles

  }
}

export default connect(mapStateToProps, actions)(Footer);
