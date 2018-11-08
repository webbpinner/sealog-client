import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Label, Thumbnail } from 'react-bootstrap';
import { connectModal } from 'redux-modal';
import { ROOT_PATH, } from '../url_config';

class ImagePreviewModal extends Component {

  constructor (props) {
    super(props);

    this.handleClose = this.handleClose.bind(this);
  }

  handleMissingImage(ev) {
    ev.target.src = `/images/noimage.jpeg`
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    filepath: PropTypes.string.isRequired,
    handleHide: PropTypes.func.isRequired,
  };

  handleClose() {
    this.props.handleDestroy();
  }

  render() {

    const { show, handleHide } = this.props

    return (
      <Modal bsSize="large" show={show} onHide={handleHide}>
        <Modal.Header closeButton>
          <Modal.Title>Image Preview - {this.props.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="text-center">
            <Thumbnail src={this.props.filepath} onError={this.handleMissingImage} />
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default connectModal({ name: 'imagePreview' })(ImagePreviewModal)
