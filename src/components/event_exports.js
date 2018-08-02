import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import { Button, Grid, Row, Col, Panel, Accordion, ListGroup, DropdownButton, ButtonToolbar, ButtonGroup, MenuItem, ListGroupItem, Pagination, Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios from 'axios';
import EventExportFilterForm from './event_export_filter_form';
import EventCommentModal from './event_comment_modal';
import * as actions from '../actions';
import { ROOT_PATH, API_ROOT_URL } from '../url_config';

let fileDownload = require('js-file-download');

const dateFormat = "YYYYMMDD"
const timeFormat = "HHmm"

class EventExport extends Component {

  constructor (props) {
    super(props);

    this.state = {
      hideASNAP: true,
      activePage: 1
    }

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
    this.setState({activePage: eventKey});
  }

  handleEventClick(id) {
    this.props.eventExportSetActiveEvent(id);
  }

  handleEventComment(id) {
    this.props.showModal('eventComment', { id: id, handleUpdateEventComment: this.props.updateEventComment, handleHide: this.props.fetchEventHistory });
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
      }
    );
  }

  fetchEventsWithAuxData(format = 'json') {

    const cookies = new Cookies();
    // console.log("event export update")
    format = `format=${format}`
    let startTS = (this.props.event_export.eventExportFilter.startTS)? `&startTS=${this.props.event_export.eventExportFilter.startTS}` : ''
    let stopTS = (this.props.event_export.eventExportFilter.stopTS)? `&stopTS=${this.props.event_export.eventExportFilter.stopTS}` : ''
    let value = (this.props.event_export.eventExportFilter.value)? `&value=${this.props.event_export.eventExportFilter.value.split(',').join("&value=")}` : ''
    let author = (this.props.event_export.eventExportFilter.author)? `&author=${this.props.event_export.eventExportFilter.author.split(',').join("&author=")}` : ''
    let freetext = (this.props.event_export.eventExportFilter.freetext)? `&freetext=${this.props.event_export.eventExportFilter.freetext}` : ''
    let datasource = (this.props.event_export.eventExportFilter.datasource)? `&datasource=${this.props.event_export.eventExportFilter.datasource}` : ''

    return axios.get(`${API_ROOT_URL}/api/v1/event_exports?${format}${startTS}${stopTS}${value}${author}${freetext}${datasource}`,
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
      }
    );
  }

  fetchEvents(format = 'json') {

    const cookies = new Cookies();
    // console.log("event export update")
    format = `format=${format}`
    let startTS = (this.props.event_export.eventExportFilter.startTS)? `&startTS=${this.props.event_export.eventExportFilter.startTS}` : ''
    let stopTS = (this.props.event_export.eventExportFilter.stopTS)? `&stopTS=${this.props.event_export.eventExportFilter.stopTS}` : ''
    let value = (this.props.event_export.eventExportFilter.value)? `&value=${this.props.event_export.eventExportFilter.value.split(',').join("&value=")}` : ''
    let author = (this.props.event_export.eventExportFilter.author)? `&author=${this.props.event_export.eventExportFilter.author.split(',').join("&author=")}` : ''
    let freetext = (this.props.event_export.eventExportFilter.freetext)? `&freetext=${this.props.event_export.eventExportFilter.freetext}` : ''
    let datasource = (this.props.event_export.eventExportFilter.datasource)? `&datasource=${this.props.event_export.eventExportFilter.datasource}` : ''

    return axios.get(`${API_ROOT_URL}/api/v1/events?${format}${startTS}${stopTS}${value}${author}${freetext}${datasource}`,
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
      }
    );
  }

  exportEventsWithAuxDataToCSV() {
    this.fetchEventsWithAuxData('csv').then((results) => {
      let prefix = moment.utc(this.props.event_export.events[0].ts).format(dateFormat + "_" + timeFormat)
      fileDownload(results, `${prefix}.sealog_export.csv`);
    }).catch((error) => {
      console.log(error)
    })
  }

  exportEventsToCSV() {
    this.fetchEvents('csv').then((results) => {
      let prefix = moment.utc(this.props.event_export.events[0].ts).format(dateFormat + "_" + timeFormat)
      fileDownload(results, `${prefix}.sealog_eventExport.csv`);
    }).catch((error) => {
      console.log(error)
    })
  }

  exportEventsWithAuxDataToJSON() {

    this.fetchEventsWithAuxData().then((results) => {
      let prefix = moment.utc(this.props.event_export.events[0].ts).format(dateFormat + "_" + timeFormat)
      fileDownload(JSON.stringify(results, null, 2), `${prefix}.sealog_export.json`);
    }).catch((error) => {
      console.log(error)
    })
  }

  exportEventsToJSON() {

    this.fetchEvents().then((results) => {
      let prefix = moment.utc(this.props.event_export.events[0].ts).format(dateFormat + "_" + timeFormat)
      fileDownload(JSON.stringify(results, null, 2), `${prefix}.sealog_eventExport.json`);
    }).catch((error) => {
      console.log(error)
    })
  }

  exportAuxDataToJSON() {

    this.fetchEventAuxData().then((results) => {
      let prefix = moment.utc(this.props.event_export.events[0].ts).format(dateFormat + "_" + timeFormat)
      fileDownload(JSON.stringify(results, null, 2), `${prefix}.sealog_auxDataExport.json`);
    }).catch((error) => {
      console.log(error)
    })
  }

  toggleASNAP() {
    this.setState( prevState => ({hideASNAP: !prevState.hideASNAP, activePage: 1}))
  }

  renderEventListHeader() {

    const Label = "Filtered Events"
    const exportTooltip = (<Tooltip id="deleteTooltip">Export these events</Tooltip>)
    const toggleASNAPTooltip = (<Tooltip id="toggleASNAPTooltip">Show/Hide ASNAP Events</Tooltip>)

    const ASNAPToggleIcon = (this.state.hideASNAP)? "Show ASNAP" : "Hide ASNAP"
    const ASNAPToggle = (<Button disabled={this.props.event_export.fetching} bsSize="xs" onClick={() => this.toggleASNAP()}>{ASNAPToggleIcon}</Button>)

    return (
      <div>
        { Label }
        <ButtonToolbar className="pull-right" >
          {ASNAPToggle}
          <DropdownButton disabled={this.props.event_export.fetching} bsSize="xs" key={1} title={<OverlayTrigger placement="top" overlay={exportTooltip}><FontAwesome name='download' fixedWidth/></OverlayTrigger>} id="export-dropdown" pullRight>
            <MenuItem key="toJSONHeader" eventKey={1.1} header>JSON format</MenuItem>
            <MenuItem key="toJSONAll" eventKey={1.2} onClick={ () => this.exportEventsWithAuxDataToJSON()}>Events w/aux data</MenuItem>
            <MenuItem key="toJSONEvents" eventKey={1.2} onClick={ () => this.exportEventsToJSON()}>Events Only</MenuItem>
            <MenuItem key="toJSONAuxData" eventKey={1.2} onClick={ () => this.exportAuxDataToJSON()}>Aux Data Only</MenuItem>
            <MenuItem divider />
            <MenuItem key="toCSVHeader" eventKey={1.5} header>CSV format</MenuItem>
            <MenuItem key="toCSVAll" eventKey={1.6} onClick={ () => this.exportEventsWithAuxDataToCSV()}>Events w/aux data</MenuItem>
            <MenuItem key="toCSVEvents" eventKey={1.6} onClick={ () => this.exportEventsToCSV()}>Events Only</MenuItem>
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

      let eventList = (this.state.hideASNAP)? this.props.event_export.events.filter(event => (event.event_value != "ASNAP")) : this.props.event_export.events
//      console.log("eventList:", eventList)

      if(eventList.length == 0){
        return (
          <Panel header={ this.renderEventListHeader() }>
            <ListGroup fill>
              <ListGroupItem>No events found!</ListGroupItem>
            </ListGroup>
          </Panel>
        )
      }

      return (          
        <Panel header={ this.renderEventListHeader() }>
          <ListGroup fill>
            {
              eventList.map((event, index) => {
                if(index >= (this.state.activePage-1) * 15 && index < (this.state.activePage * 15)) {
                  let eventOptionsArray = [];
                  event.event_options.map((option) => {
                    if (option.event_option_name != 'event_comment') {
                      eventOptionsArray.push(option.event_option_name.replace(/\s+/g, "_") + ": \"" + option.event_option_value + "\"");
                    }
                  })
                  
                  if (event.event_free_text) {
                    eventOptionsArray.push("text: \"" + event.event_free_text + "\"")
                  } 

                  let eventOptions = (eventOptionsArray.length > 0)? '--> ' + eventOptionsArray.join(', '): ''
                  let commentTooltip = (<Tooltip id={`commentTooltip_${event.id}`}>Add Comment</Tooltip>)

                  return (
                    <ListGroupItem key={event.id} >{`${event.ts} <${event.event_author}>: ${event.event_value} ${eventOptions}`}<span className="pull-right" onClick={() => this.handleEventComment(event.id)}><OverlayTrigger placement="top" overlay={commentTooltip}><FontAwesome name='comment' fixedWidth/></OverlayTrigger></span></ListGroupItem>
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

      let eventCount = (this.state.hideASNAP)? this.props.event_export.events.filter(event => event.event_value != "ASNAP").length : this.props.event_export.events.length

      return (
        <Pagination
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          items={ Math.ceil(eventCount/15) }
          maxButtons={5}
          activePage={this.state.activePage}
          onSelect={this.handlePageSelect}
        />
      )
    }
  }

  render(){
    // console.log(this.props.event_export)
    return (
      <Grid fluid>
        <EventCommentModal />
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
