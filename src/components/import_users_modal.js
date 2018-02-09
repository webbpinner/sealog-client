import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import { connectModal } from 'redux-modal';
import FontAwesome from 'react-fontawesome';
import ReactUploadFile from 'react-upload-file';
import { API_ROOT_URL } from '../url_config';

class ImportUsersModal extends Component {

  constructor (props) {
    super(props);

    this.handleConfirm = this.handleConfirm.bind(this);
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
    const options = {
      baseUrl: API_ROOT_URL,
      query: {
        warrior: 'fight'
      }
    }

    return (
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>Import Users</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <ReactUploadFile options={options} chooseFileButton={<Button bsStyle="primary">Browse</Button>} uploadFileButton={<Button bsStyle="primary">Import</Button>}/>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={handleHide}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connectModal({ name: 'importUsers' })(ImportUsersModal)