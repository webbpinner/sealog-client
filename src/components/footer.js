import React, {Component} from 'react';
import { ThemeChooser } from 'react-bootstrap-theme-switcher';

import { connect } from 'react-redux';
import { Grid } from 'react-bootstrap';

class Footer extends Component {

  constructor (props) {
    super(props);
  }

  render () {

    const github = "https://github.com/webbpinner/sealog-client";
    const license = "http://www.gnu.org/licenses/gpl-3.0.html";
    return (
      <Grid fluid>
        <hr/>
        <div className="pull-right">
          <a href={github} target="_blank">Sea Log Client</a> is licensed under the <a href={license} target="_blank">GPLv3</a> public license
        </div>
        <ThemeChooser/>
      </Grid>
    );
  }
}

function mapStateToProps(state){
  return {
  };
}

export default connect(mapStateToProps, null)(Footer);