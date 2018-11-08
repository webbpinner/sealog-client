import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Button, Modal, Grid, Row, Col } from 'react-bootstrap';
import { connectModal } from 'redux-modal';
import Cookies from 'universal-cookie';
import { API_ROOT_URL } from '../url_config';

const cookies = new Cookies();

const style = {wordWrap:'break-word'}

class DisplayUserTokenModal extends Component {

  constructor (props) {
    super(props);

    this.state = {
      token: null
    }

    this.handleConfirm = this.handleConfirm.bind(this);
  }

  static propTypes = {
    id: PropTypes.string.isRequired,
  };

  componentWillMount() {
    axios.get(`${API_ROOT_URL}/api/v1/users/${this.props.id}/token`,
    {
      headers: {
        authorization: cookies.get('token'),
        'content-type': 'application/json'
      }
    })
    .then((response) => {

      // console.log("Token Found");
      this.setState( { token: response.data.token} )
    })
    .catch((error) => {
      this.setState( {token: "There was an error retriving the JWT for this user."})
    })
  }

  // static propTypes = {
  //   handleImport: PropTypes.func.isRequired,
  //   handleHide: PropTypes.func.isRequired
  // };

  handleConfirm() {
//    this.props.handleImport();
    this.props.handleDestroy();
  }

  render() {

    const { show, handleHide } = this.props

    return (
      <Modal show={show} onHide={handleHide}>
        <Modal.Header closeButton>
          <Modal.Title>User's Java Web Token</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Grid fluid>
            <Row>
              <Col xs={12}>
                <h6>Token:</h6><div style={style}>{this.state.token}</div>
              </Col>
            </Row>
          </Grid>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={handleHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connectModal({ name: 'displayUserToken' })(DisplayUserTokenModal)