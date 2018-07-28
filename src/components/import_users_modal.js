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

class ImportUsersModal extends Component {

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

  importUsersFromFile = (e) => {
    try {
      let json = JSON.parse(e.target.result);
        this.setState( prevState => (
          {
            pending: json.length,
            imported: 0,
            errors: 0,
            skipped: 0
          }
        ))
      // console.log(json);
      let promises = json.map(({id, username, fullname, email, password = '', roles = []}) => {
        return axios.get(`${API_ROOT_URL}/api/v1/users/${id}`,
        {
          headers: {
            authorization: cookies.get('token'),
            'content-type': 'application/json'
          }
        })
        .then((response) => {

          // console.log("User Already Exists");
          this.setState( prevState => (
            {
              skipped: prevState.skipped + 1,
              pending: prevState.pending - 1
            }
          ))
        })
        .catch((error) => {

          if(error.response.data.statusCode == 404) {
            // console.log("Attempting to add event")

            axios.post(`${API_ROOT_URL}/api/v1/users`,
            {id, username, fullname, email, password, roles},
            {
              headers: {
                authorization: cookies.get('token'),
                'content-type': 'application/json'
              }
            })
            .then((response) => {
              // console.log("User Imported");
              this.setState( prevState => (
                {
                  imported: prevState.imported + 1,
                  pending: prevState.pending - 1
                }
              ))
              return true
            })
            .catch((error) => {
              
              if(error.response.data.statusCode == 400) {
                // console.log("User Data malformed or incomplete");
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

            if(error.response.data.statusCode != 400) {
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
      Promise.all(promises).then(()=> {
        // console.log("done")
      })
    } catch (err) {
      console.log('error when trying to parse json = ' + err);
    }
  }

  handleUserRecordImport = files => {

    let reader = new FileReader();
    reader.onload = this.importUsersFromFile
    reader.readAsText(files[0]);
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
      <Modal show={show} onHide={handleHide}>
        <Modal.Header closeButton>
          <Modal.Title>Import Users</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Grid fluid>
            <Row>
              <Col xs={6}>
                <ReactFileReader fileTypes={[".json"]} handleFiles={this.handleUserRecordImport}>
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

export default connectModal({ name: 'importUsers' })(ImportUsersModal)