import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import { Button, Grid, Row, Col, Panel, Accordion, ListGroup, DropdownButton, ButtonToolbar, ButtonGroup, MenuItem, ListGroupItem, Pagination, Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios from 'axios';
import EventExportFilterForm from './event_export_filter_form';
import * as actions from '../actions';
import { ROOT_PATH, API_ROOT_URL } from '../url_config';

let converter = require('json-2-csv');
let fileDownload = require('js-file-download');

const options = {
  checkSchemaDifferences: false
}

const json2csvAllCallback = function (err, csv) {
  if (err) throw err;
  // console.log(csv);
  fileDownload(csv, 'seaplayExport.csv');
};

const json2csvEventsCallback = function (err, csv) {
  if (err) throw err;
  // console.log(csv);
  fileDownload(csv, 'seaplayExport_Events.csv');
};

const json2csvAuxDataCallback = function (err, csv) {
  if (err) throw err;
  // console.log(csv);
  fileDownload(csv, 'seaplayExport_AuxData.csv');
};

class EventExport extends Component {

  constructor (props) {
    super(props);

    this.handleEventClick = this.handleEventClick.bind(this);
    this.handlePageSelect = this.handlePageSelect.bind(this);
  }

  componentWillMount(){
    this.props.initEventExport();
  }

  componentDidUpdate() {
  }

  componentWillUnmount(){
    // console.log("Leaving event export")
    this.props.leaveEventExportFilterForm();
  }

  handlePageSelect(eventKey) {
    // console.log("eventKey:", eventKey)
    this.props.eventExportSetActivePage(eventKey);
  }

  handleEventClick(id) {
    this.props.eventExportSetActiveEvent(id);
  }

  fetchEventAuxData() {

  const cookies = new Cookies();
  // console.log("event export update")
  let startTS = (this.props.event_export.eventExportFilter.startTS)? `startTS=${this.props.event_export.eventExportFilter.startTS}` : ''
  let stopTS = (this.props.event_export.eventExportFilter.stopTS)? `&stopTS=${this.props.event_export.eventExportFilter.stopTS}` : ''
  let value = (this.props.event_export.eventExportFilter.value)? `&value=${this.props.event_export.eventExportFilter.value.split(',').join("&value=")}` : ''
  let author = (this.props.event_export.eventExportFilter.author)? `&author=${this.props.event_export.eventExportFilter.author.split(',').join("&author=")}` : ''
  let freetext = (this.props.event_export.eventExportFilter.freetext)? `&freetext=${this.props.event_export.eventExportFilter.freetext}` : ''
  let datasource = (this.props.event_export.eventExportFilter.datasource)? `&datasource=${this.props.event_export.eventExportFilter.datasource}` : ''

  return axios.get(`${API_ROOT_URL}/api/v1/event_aux_data?${startTS}${stopTS}${value}${author}${freetext}${datasource}`,
    {
      headers: {
        authorization: cookies.get('token')
      }
    }).then((response) => {
      return response.data
    }).catch((error)=>{
      if(error.response.data.statusCode == 404){
        return []
      } else {
        console.log(error.response);
        return []
      }
    });
  }

  exportAllToCSV() {
    // console.log("Pre-Export:", this.props.event_export.events)
    let exportData = this.props.event_export.events.map((event) => {
      var copiedEvent = jQuery.extend(true, {}, event)
      copiedEvent.aux_data.map((data) => {
        data.data_array.map((data2) => {

          let elementName = `${data.data_source}_${data2.data_name}_value`
          let elementUOM = `${data.data_source}_${data2.data_name}_uom`
         // console.log(elementName, data2.data_value, elementUOM, data2.data_uom)
          copiedEvent[elementName] = data2.data_value
          copiedEvent[elementUOM] = data2.data_uom
        })  
      })
      delete copiedEvent.aux_data


      copiedEvent.event_options.map((data) => {
        let elementName = `event_option_${data.event_option_name}`
       // console.log(elementName, data.event_option_value)
        copiedEvent[elementName] = data.event_option_value
      })

      delete copiedEvent.event_options

      return copiedEvent

    })

    converter.json2csv(exportData, json2csvAllCallback, options);
   // console.log("Post-Export:", exportData)
  }

  exportEventsToCSV() {
    // console.log("Pre-Export:", this.props.event_export.events)
    let exportData = this.props.event_export.events.map((event) => {
      
      var copiedEvent = jQuery.extend(true, {}, event)

      delete copiedEvent.aux_data

      copiedEvent.event_options.map((data) => {
        let elementName = `event_option_${data.event_option_name}`
       // console.log(elementName, data.event_option_value)
        copiedEvent[elementName] = data.event_option_value
      })

      delete copiedEvent.event_options

      return copiedEvent

    })

    converter.json2csv(exportData, json2csvEventsCallback, options);
   // console.log("Post-Export:", exportData)
  }

  exportAuxDataToCSV() {
    this.fetchEventAuxData().then((results) => {
      // console.log("results:", results)
      let exportData = results.map((auxData) => {
        var copiedAuxData = jQuery.extend(true, {}, auxData)
        copiedAuxData.data_array.map((data) => {
          let elementName = `${auxData.data_source}_${data.data_name}_value`
          let elementUOM = `${auxData.data_source}_${data.data_name}_uom`
         // console.log(elementName, data2.data_value, elementUOM, data2.data_uom)
          copiedAuxData[elementName] = data.data_value
          copiedAuxData[elementUOM] = data.data_uom
        })

        delete copiedAuxData.data_array
        return copiedAuxData
      })

      converter.json2csv(exportData, json2csvAuxDataCallback, options);
    }).catch((error) => {
      console.log(error)
    })
  }

  exportAllToJSON() {
    fileDownload(JSON.stringify(this.props.event_export.events, null, 2), 'sealogExport.json');
  }

  exportEventsToJSON() {
    let eventsOnly = this.props.event_export.events.map((event) => {
      delete event.aux_data
      return event
    })

    fileDownload(JSON.stringify(eventsOnly, null, 2), 'sealogExport_Events.json');
  }

  exportAuxDataToJSON() {
    this.fetchEventAuxData().then((results) => {
      // console.log("results:", results)
      fileDownload(JSON.stringify(results, null, 2), 'sealogExport_AuxData.json');
    }).catch((error) => {
      console.log(error)
    })
  }

  renderEventListHeader() {

    const Label = "Filtered Events"
    const exportTooltip = (<Tooltip id="deleteTooltip">Export these events</Tooltip>)


        // <div className="pull-right">
          // <Button bsStyle="default" bsSize="xs" type="button" onClick={ this.handleExportEventList } disabled={this.props.event_export.fetching} ><OverlayTrigger placement="top" overlay={exportTooltip}><FontAwesome name='download' fixedWidth/></OverlayTrigger></Button>
        // </div>

    return (
      <div>
        { Label }
        <ButtonToolbar className="pull-right" >
          <DropdownButton disabled={this.props.event_export.fetching} bsSize="xs" key={1} title={<OverlayTrigger placement="top" overlay={exportTooltip}><FontAwesome name='download' fixedWidth/></OverlayTrigger>} id="export-dropdown" pullRight>
            <MenuItem key="toJSONHeader" eventKey={1.1} header>JSON format</MenuItem>
            <MenuItem key="toJSONAll" eventKey={1.2} onClick={ () => this.exportAllToJSON()}>Events w/aux data</MenuItem>
            <MenuItem key="toJSONEvents" eventKey={1.2} onClick={ () => this.exportEventsToJSON()}>Events Only</MenuItem>
            <MenuItem key="toJSONAuxData" eventKey={1.2} onClick={ () => this.exportAuxDataToJSON()}>Aux Data Only</MenuItem>
            <MenuItem divider />
            <MenuItem key="toCSVHeader" eventKey={1.5} header>CSV format</MenuItem>
            <MenuItem key="toCSVAll" eventKey={1.6} onClick={ () => this.exportAllToCSV()}>Events w/aux data</MenuItem>
            <MenuItem key="toCSVEvents" eventKey={1.6} onClick={ () => this.exportEventsToCSV()}>Events Only</MenuItem>
            <MenuItem key="toCSVAuxData" eventKey={1.6} onClick={ () => this.exportAuxDataToCSV()}>Aux Data Only</MenuItem>
          </DropdownButton>
        </ButtonToolbar>
      </div>
    );
  }

  renderEventPanel() {

    if(this.props.event_export.fetching) {
      return (
        <Panel header={ this.renderEventListHeader() }>
          <ListGroup fill>
            <ListGroupItem>Loading...</ListGroupItem>
          </ListGroup>
        </Panel>
      )
    } else if(this.props.event_export && this.props.event_export.events.length > 0) {
      return (          
        <Panel header={ this.renderEventListHeader() }>
          <ListGroup fill>
            {
              this.props.event_export.events.map((event, index) => {
                if(index >= (this.props.event_export.activePage-1) * 15 && index < (this.props.event_export.activePage * 15)) {
                  return (
                    <ListGroupItem key={event.id} onClick={() => this.handleEventClick(event.id)} >{`${event.ts} ${event.event_author}: ${event.event_value}`}</ListGroupItem>
                  )
                }
              })
            }
          </ListGroup>
        </Panel>
      );
    } else {
      return (
        <Panel header={ this.renderEventListHeader() }>
          <ListGroup fill>
            <ListGroupItem>No events found!</ListGroupItem>
          </ListGroup>
        </Panel>
      )
    }
  }

  renderPagination() {
    if(!this.props.event_export.fetching && this.props.event_export.events.length > 0) {
      return (
        <Pagination
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          items={ Math.ceil(this.props.event_export.events.length/15) }
          maxButtons={5}
          activePage={this.props.event_export.activePage}
          onSelect={this.handlePageSelect}
        />
      )
    }
  }

  renderExportNav() {
    return (
      <ButtonToolbar className="pull-right" >
        <DropdownButton disabled={this.props.event_export.fetching} bsSize="small" key={1} title={'Export Data'} id="export-dropdown">
          <MenuItem key="toJSON" eventKey={1.1} onClick={ () => this.exportDataToJSON()}>JSON format</MenuItem>
          <MenuItem key="toCSV" eventKey={1.1} onClick={ () => this.exportDataToCSV()}>CSV format</MenuItem>
        </DropdownButton>
      </ButtonToolbar>
    )
  } 


  render(){
    // console.log(this.props.event_export)
    return (
      <Grid fluid>
        <Row>
          <Col sm={6} md={4} lg={3}>
            <EventExportFilterForm disabled={this.props.event_export.fetching} />
          </Col>
          <Col sm={6} md={8} lg={9}>
            {this.renderEventPanel()}
            {this.renderPagination()}
          </Col>
        </Row>
      </Grid>
    )
  }
}

function mapStateToProps(state) {
  return {
    roles: state.user.profile.roles,
    event_export: state.event_export
  }
}

export default connect(mapStateToProps, null)(EventExport);
