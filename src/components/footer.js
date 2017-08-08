import React, {Component} from 'react';
import { ThemeChooser } from 'react-bootstrap-theme-switcher';

import { connect } from 'react-redux';
import { Grid, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ROOT_PATH } from '../url_config';

class Footer extends Component {

  constructor (props) {
    super(props);
  }

  render () {
    return (
      <Grid fluid>
        <hr/>
        <div className="pull-right">
          <a href="https://github.com/webbpinner/sealog-client" target="_blank">Sea Log Client</a> is licensed under the <a target="_blank" href="http://www.gnu.org/licenses/gpl-3.0.html">GPLv3</a> public license
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