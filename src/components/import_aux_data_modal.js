import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Button, Modal, Row, Col } from 'react-bootstrap';
import { connectModal } from 'redux-modal';
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
      updated: 0,
      quit: false,
    }

    this.handleHideCustom = this.handleHideCustom.bind(this);
  }

  handleHideCustom() {
    this.setState({quit: true})
    this.props.handleHide()
  }

  async insertAuxData({id, event_id, data_source, data_array}) {

    try { 
      const result = await axios.post(`${API_ROOT_URL}/api/v1/event_aux_data`,
      {id, event_id, data_source, data_array},
      {
        headers: {
          authorization: cookies.get('token'),
          'content-type': 'application/json'
        }
      })

      if(result) {
        if(result.status === 201) {
          this.setState( prevState => (
            {
              imported: prevState.imported + 1,
              pending: prevState.pending - 1
            }
          ))
        } else {
          this.setState( prevState => (
            {
              updated: prevState.updated + 1,
              pending: prevState.pending - 1
            }
          ))
        }
      }

    } catch(error) {
      console.log(error)
      this.setState( prevState => (
        {
          errors: prevState.errors + 1,
          pending: prevState.pending - 1
        }
      ))
    }
  }

  importAuxDataFromFile = async (e) => {
    try {

      // console.log("processing file")
      let json = JSON.parse(e.target.result);
        this.setState( prevState => (
          {
            pending: json.length,
            imported: 0,
            errors: 0,
            updated: 0
          }
        ))

      // console.log("done")
      let currentAuxData;

      for(let i = 0; i < json.length; i++) {
        if (this.state.quit) {
          console.log("quiting")
          break;
        }
        currentAuxData = json[i];
        // console.log("adding aux data")
        await this.insertAuxData(currentAuxData);
      }

    } catch (err) {
      console.log('error when trying to parse json = ' + err);
    }
    this.setState({pending: (this.state.quit)?"Quit Early!":"Complete"})    
  }

  handleAuxDataRecordImport = files => {

    let reader = new FileReader();
    reader.onload = this.importAuxDataFromFile
    reader.readAsText(files[0]);
  }

  render() {

    const { show } = this.props

    return (
      <Modal show={show} onHide={this.handleHideCustom}>
        <Modal.Header closeButton>
          <Modal.Title>Import Auxiliary Data</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Col xs={6}>
              <ReactFileReader fileTypes={[".json"]} handleFiles={this.handleAuxDataRecordImport}>
                  <Button>Select File</Button>
              </ReactFileReader>
            </Col>
            <Col xs={6}>
              Pending: {this.state.pending}
              <hr/>
              Imported: {this.state.imported}<br/>
              Updated: {this.state.updated}<br/>
              Errors: {this.state.errors}<br/>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.handleHideCustom}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connectModal({ name: 'importAuxData' })(ImportAuxDataModal)