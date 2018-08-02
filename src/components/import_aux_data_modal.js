import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Button, Modal, Grid, Row, Col } from 'react-bootstrap';
import { connectModal } from 'redux-modal';
import FontAwesome from 'react-fontawesome';
import ReactFileReader from 'react-file-reader';
import Cookies from 'universal-cookie';
import { API_ROOT_URL } from '../url_config';


const cookies = new Cookies();

class ImportAuxDataModal extends Component {

  constructor (props) {
    super(props);

    this.state = {
      pending: 0,
      imported: 0,
      errors: 0,
      skipped: 0
    }

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

  importAuxDataFromFile = (e) => {
    let json = [];

    try {
      json = JSON.parse(e.target.result);
    } catch (err) {
      console.log('error when trying to parse json = ' + err);
      return null
    }

    this.setState( prevState => (
      {
        pending: json.length,
        imported: 0,
        errors: 0,
        skipped: 0
      }
    ))

    // console.log(json);
    let promises = json.map(({id, event_id, data_source, data_array}) => {

      return axios.get(`${API_ROOT_URL}/api/v1/event_aux_data/${id}`,
      {
        headers: {
          authorization: cookies.get('token'),
          'content-type': 'application/json'
        }
      })
      .then((response) => {

        // console.log("AuxData Already Exists");
        this.setState( prevState => (
          {
            skipped: prevState.skipped + 1,
            pending: prevState.pending - 1
          }
        ))
      })
      .catch((error) => {

        if(error.response && error.response.data.statusCode == 404) {
          // console.log("Attempting to add event")

          axios.post(`${API_ROOT_URL}/api/v1/event_aux_data`,
          {id, event_id, data_source, data_array},
          {
            headers: {
              authorization: cookies.get('token'),
              'content-type': 'application/json'
            }
          })
          .then((response) => {
            // console.log("AuxData Imported");
            this.setState( prevState => (
              {
                imported: prevState.imported + 1,
                pending: prevState.pending - 1
              }
            ))
            return true
          })
          .catch((error) => {
            
            if(error.response && error.response.data.statusCode == 400) {
              // console.log("AuxData Data malformed or incomplete");
            } else {
              console.log(error);  
            }
            
            this.setState( prevState => (
              {
                errors: prevState.errors + 1,
                pending: prevState.pending - 1
              }
            ))
            return false
          });
        } else {

          if(error.response && error.response.data.statusCode != 400) {
            console.log(error.response);
          }
          this.setState( prevState => (
            {
              errors: prevState.errors + 1,
              pending: prevState.pending - 1
            }
          ))
        }
      });
    })

    // console.log("Promises:", promises)
    // Promise.all(promises).then(()=> {
    //   // console.log("done")
    // })
  }

  handleAuxDataRecordImport = files => {

    let reader = new FileReader();
    reader.onload = this.importAuxDataFromFile
    reader.readAsText(files[0]);
  }

  render() {

    const { show, handleHide } = this.props

    return (
      <Modal show={show} onHide={handleHide}>
        <Modal.Header closeButton>
          <Modal.Title>Import Auxiliary Data</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Grid fluid>
            <Row>
              <Col xs={6}>
                <ReactFileReader fileTypes={[".json"]} handleFiles={this.handleAuxDataRecordImport}>
                    <Button>Select File</Button>
                </ReactFileReader>
              </Col>
              <Col xs={3}>
                Pending: {this.state.pending}
                <hr/>
                Imported: {this.state.imported}<br/>
                Skipped: {this.state.skipped}<br/>
                Errors: {this.state.errors}<br/>
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

export default connectModal({ name: 'importAuxData' })(ImportAuxDataModal)