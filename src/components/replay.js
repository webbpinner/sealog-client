import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';
import { Button, Grid, Row, Col, Panel, Accordion, Pagination, ListGroup, ListGroupItem, MenuItem, Thumbnail, Well, OverlayTrigger, Tooltip, ButtonToolbar, DropdownButton } from 'react-bootstrap';
import 'rc-slider/assets/index.css';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import { Line } from 'rc-progress';
import EventFilterForm from './event_filter_form';
import EventCommentModal from './event_comment_modal';
import * as actions from '../actions';
import { ROOT_PATH, API_ROOT_URL, IMAGE_PATH } from '../url_config';

let fileDownload = require('js-file-download');

const dateFormat = "YYYYMMDD"
const timeFormat = "HHmm"

const cookies = new Cookies();

const imagePanelStyle = {minHeight: "100px"}

const playTimer = 3000
const ffwdTimer = 1000

const PLAY = 0
const PAUSE = 1
const FFWD = 2
const FREV = 3

// const SliderWithTooltip = createSliderWithTooltip(Slider);

class Replay extends Component {

  constructor (props) {
    super(props);

    this.state = {
      replayTimer: null,
      replayState: PAUSE,
      replayEventIndex: 0,
      hideASNAP: false,
      activePage: 1
    }

    this.sliderTooltipFormatter = this.sliderTooltipFormatter.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleEventClick = this.handleEventClick.bind(this);
    this.handlePageSelect = this.handlePageSelect.bind(this);
    this.replayAdvance = this.replayAdvance.bind(this);
    this.replayReverse = this.replayReverse.bind(this);
  }

  componentWillMount() {
    this.props.initReplay(this.props.match.params.id, this.state.hideASNAP);
  }

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  componentWillUnmount(){
    if(this.state.replayTimer) {
      clearInterval(this.state.replayTimer);
    }
  }

  toggleASNAP() {
    this.props.eventUpdateReplay(!this.state.hideASNAP)
    this.handleReplayPause();
    this.setState( prevState => ({hideASNAP: !prevState.hideASNAP, activePage: 1, replayEventIndex: 0}))
  }

  fetchEventAuxData() {

    const cookies = new Cookies();
    let startTS = (this.props.event.eventFilter.startTS)? `startTS=${this.props.event.eventFilter.startTS}` : ''
    let stopTS = (this.props.event.eventFilter.stopTS)? `&stopTS=${this.props.event.eventFilter.stopTS}` : ''
    let value = (this.props.event.eventFilter.value)? `&value=${this.props.event.eventFilter.value.split(',').join("&value=")}` : ''
    value = (this.state.hideASNAP)? `&value=!ASNAP${value}` : value;
    let author = (this.props.event.eventFilter.author)? `&author=${this.props.event.eventFilter.author.split(',').join("&author=")}` : ''
    let freetext = (this.props.event.eventFilter.freetext)? `&freetext=${this.props.event.eventFilter.freetext}` : ''
    let datasource = (this.props.event.eventFilter.datasource)? `&datasource=${this.props.event.eventFilter.datasource}` : ''

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
    let startTS = (this.props.event.eventFilter.startTS)? `&startTS=${this.props.event.eventFilter.startTS}` : ''
    let stopTS = (this.props.event.eventFilter.stopTS)? `&stopTS=${this.props.event.eventFilter.stopTS}` : ''
    let value = (this.props.event.eventFilter.value)? `&value=${this.props.event.eventFilter.value.split(',').join("&value=")}` : ''
    value = (this.state.hideASNAP)? `&value=!ASNAP${value}` : value;
    let author = (this.props.event.eventFilter.author)? `&author=${this.props.event.eventFilter.author.split(',').join("&author=")}` : ''
    let freetext = (this.props.event.eventFilter.freetext)? `&freetext=${this.props.event.eventFilter.freetext}` : ''
    let datasource = (this.props.event.eventFilter.datasource)? `&datasource=${this.props.event.eventFilter.datasource}` : ''

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
    let startTS = (this.props.event.eventFilter.startTS)? `&startTS=${this.props.event.eventFilter.startTS}` : ''
    let stopTS = (this.props.event.eventFilter.stopTS)? `&stopTS=${this.props.event.eventFilter.stopTS}` : ''
    let value = (this.props.event.eventFilter.value)? `&value=${this.props.event.eventFilter.value.split(',').join("&value=")}` : ''
    value = (this.state.hideASNAP)? `&value=!ASNAP${value}` : value;
    let author = (this.props.event.eventFilter.author)? `&author=${this.props.event.eventFilter.author.split(',').join("&author=")}` : ''
    let freetext = (this.props.event.eventFilter.freetext)? `&freetext=${this.props.event.eventFilter.freetext}` : ''
    let datasource = (this.props.event.eventFilter.datasource)? `&datasource=${this.props.event.eventFilter.datasource}` : ''

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
      let prefix = moment.utc(this.props.event.events[0].ts).format(dateFormat + "_" + timeFormat)
      fileDownload(results, `${prefix}.sealog_export.csv`);
    }).catch((error) => {
      console.log(error)
    })
  }

  exportEventsToCSV() {
    this.fetchEvents('csv').then((results) => {
      let prefix = moment.utc(this.props.event.events[0].ts).format(dateFormat + "_" + timeFormat)
      fileDownload(results, `${prefix}.sealog_eventExport.csv`);
    }).catch((error) => {
      console.log(error)
    })
  }

  exportEventsWithAuxDataToJSON() {

    this.fetchEventsWithAuxData().then((results) => {
      let prefix = moment.utc(this.props.event.events[0].ts).format(dateFormat + "_" + timeFormat)
      fileDownload(JSON.stringify(results, null, 2), `${prefix}.sealog_export.json`);
    }).catch((error) => {
      console.log(error)
    })
  }

  exportEventsToJSON() {

    this.fetchEvents().then((results) => {
      let prefix = moment.utc(this.props.event.events[0].ts).format(dateFormat + "_" + timeFormat)
      fileDownload(JSON.stringify(results, null, 2), `${prefix}.sealog_eventExport.json`);
    }).catch((error) => {
      console.log(error)
    })
  }

  exportAuxDataToJSON() {

    this.fetchEventAuxData().then((results) => {
      let prefix = moment.utc(this.props.event.events[0].ts).format(dateFormat + "_" + timeFormat)
      fileDownload(JSON.stringify(results, null, 2), `${prefix}.sealog_auxDataExport.json`);
    }).catch((error) => {
      console.log(error)
    })
  }

  sliderTooltipFormatter(v) {
    let duration = (this.props.event.events.length > 0)? this.props.event.events[v].ts : ''
    return `${duration}`;
  }

  handleSliderChange(index) {
    this.handleReplayPause();
    this.setState({replayEventIndex: index})
    this.props.advanceReplayTo(this.props.event.events[index].id)
    this.setState({activePage: Math.ceil((index+1)/7)})
  }

  handleEventClick(index) {
    this.handleReplayPause();
    this.setState({replayEventIndex: index})
    this.props.advanceReplayTo(this.props.event.events[index].id)
    this.setState({activePage: Math.ceil((index+1)/7)})
  }

  handleEventComment(index) {
    this.handleReplayPause();
    this.setState({replayEventIndex: index})
    this.props.advanceReplayTo(this.props.event.events[index].id)
    this.props.showModal('eventComment', { event: this.props.event.events[index], handleUpdateEvent: this.props.updateEvent });
  }

  handlePageSelect(eventKey) {
    this.handleReplayPause();
    this.setState({activePage: eventKey, replayEventIndex: (eventKey-1)*7 });
    this.props.advanceReplayTo(this.props.event.events[(eventKey-1)*7].id)
  }

  handleReplayStart() {
    this.handleReplayPause();
    this.setState({replayEventIndex: 0})
    this.props.advanceReplayTo(this.props.event.events[this.state.replayEventIndex].id)
    this.setState({activePage: Math.ceil((this.state.replayEventIndex+1)/7)})
  }

  handleReplayEnd() {
    this.handleReplayPause();
    this.setState({replayEventIndex: this.props.event.events.length-1})
    this.props.advanceReplayTo(this.props.event.events[this.state.replayEventIndex].id)
    this.setState({activePage: Math.ceil((this.state.replayEventIndex+1)/7)})
  }

  handleReplayFRev() {
    this.setState({replayState: FREV})    
    if(this.state.replayTimer != null) {
      clearInterval(this.state.replayTimer);
    }
    this.setState({replayTimer: setInterval(this.replayReverse, ffwdTimer)})
  }

  handleReplayPlay() {
    this.setState({replayState: PLAY})
    if(this.state.replayTimer != null) {
      clearInterval(this.state.replayTimer);
    }
    this.setState({replayTimer: setInterval(this.replayAdvance, playTimer)})
  }

  handleReplayPause() {
    this.setState({replayState: PAUSE})
    if(this.state.replayTimer != null) {
      clearInterval(this.state.replayTimer);
    }
    this.setState({replayTimer: null})
  }

  handleReplayFFwd() {
    this.setState({replayState: FFWD})
    if(this.state.replayTimer != null) {
      clearInterval(this.state.replayTimer);
    }
    this.setState({replayTimer: setInterval(this.replayAdvance, ffwdTimer)})

  }

  replayAdvance() {
    if(this.state.replayEventIndex < (this.props.event.events.length - 1)) {
      this.setState({replayEventIndex: this.state.replayEventIndex + 1})
      this.props.advanceReplayTo(this.props.event.events[this.state.replayEventIndex].id)
      this.setState({activePage: Math.ceil((this.state.replayEventIndex+1)/7)})
    } else {
      this.setState({replayState: PAUSE})
    }
  }

  replayReverse() {
    if(this.state.replayEventIndex > 0) {
      this.setState({replayEventIndex: this.state.replayEventIndex - 1})
      this.props.advanceReplayTo(this.props.event.events[this.state.replayEventIndex].id)
      this.setState({activePage: Math.ceil((this.state.replayEventIndex+1)/7)})
    } else {
      this.setState({replayState: PAUSE})
    }
  }

  renderAuxDataPanel() {

    let return_aux_data = []
    if(this.props.event && this.props.event.selected_event && this.props.event.selected_event.aux_data) {
      return this.props.event.selected_event.aux_data.map((aux_data, index) => {
        let return_data = aux_data.data_array.map((data, index) => {
          return (<div key={`${aux_data.data_source}_data_point_${index}`}><label>{data.data_name}:</label><span> {data.data_value} {data.data_uom}</span></div>)
        })
        return (
          <Col key={`${aux_data.data_source}`} xs={12} sm={6} md={4}>
            <Panel>
              <label>{aux_data.data_source}:</label>
              <ul>
                {return_data}
                </ul>
            </Panel>
          </Col>
        )
      })
    }  

    return null
  }


  renderControlsPanel() {

    if(this.props.event && this.props.event.events.length > 0) {
      let startTime = moment(this.props.event.events[0].ts)
      let endTime = moment(this.props.event.events[this.props.event.events.length-1].ts)

      let replayOffset = (this.props.event.selected_event.ts)? moment(this.props.event.selected_event.ts).diff(startTime) : 0
      let duration = endTime.diff(startTime)
      
      let playPause = (this.state.replayState != 1)? <Link key={`pause`} to="#" onClick={ () => this.handleReplayPause() }><FontAwesomeIcon icon="pause"/>{' '}</Link> : <Link key={`play`} to="#" onClick={ () => this.handleReplayPlay() }><FontAwesomeIcon icon="play"/>{' '}</Link>;

      let buttons = (this.props.event.selected_event.ts && !this.props.event.fetching)? (
        <div className="text-center">
          <Link key={`start`} to="#" onClick={ () => this.handleReplayStart() }><FontAwesomeIcon icon="step-backward"/>{' '}</Link>
          <Link key={`frev`} to="#" onClick={ () => this.handleReplayFRev() }><FontAwesomeIcon icon="backward"/>{' '}</Link>
          {playPause}
          <Link key={`ffwd`} to="#" onClick={ () => this.handleReplayFFwd() }><FontAwesomeIcon icon="forward"/>{' '}</Link>
          <Link key={`end`} to="#" onClick={ () => this.handleReplayEnd() }><FontAwesomeIcon icon="step-forward"/>{' '}</Link>
        </div>
      ):(
        <div className="text-center">
          <FontAwesomeIcon icon="step-backward"/>{' '}
          <FontAwesomeIcon icon="backward"/>{' '}
          <FontAwesomeIcon icon="play"/>{' '}
          <FontAwesomeIcon icon="forward"/>{' '}
          <FontAwesomeIcon icon="step-forward"/>
        </div>
      )

      return (
        <Panel>
          <Panel.Body>
            <Slider
              tipProps={{ overlayClassName: 'foo' }}
              trackStyle={{ opacity: 0.5 }}
              railStyle={{ opacity: 0.5 }}
              onAfterChange={this.handleSliderChange}
              max={this.props.event.events.length-1}
            />
            <Row>
              <Col xs={4}>
                  00:00:00
              </Col>
              <Col xs={4}>
                  {buttons}
              </Col>
              <Col xs={4}>
                <div className="pull-right">
                  {moment.duration(duration).format("d [days] hh:mm:ss")}
                </div>
              </Col>
            </Row>
            <Line percent={(this.props.event.fetching)? 0 : 100 * replayOffset / duration} strokeWidth={"1"} />
          </Panel.Body>
        </Panel>
      );
    }
  }

  renderEventListHeader() {

    const Label = "Filtered Events"
    const exportTooltip = (<Tooltip id="deleteTooltip">Export these events</Tooltip>)
    const toggleASNAPTooltip = (<Tooltip id="toggleASNAPTooltip">Show/Hide ASNAP Events</Tooltip>)

    const ASNAPToggleIcon = (this.state.hideASNAP)? "Show ASNAP" : "Hide ASNAP"
    const ASNAPToggle = (<Button disabled={this.props.event.fetching} bsSize="xs" onClick={() => this.toggleASNAP()}>{ASNAPToggleIcon}</Button>)

    return (
      <div>
        { Label }
        <ButtonToolbar className="pull-right" >
          {ASNAPToggle}
          <DropdownButton disabled={this.props.event.fetching} bsSize="xs" key={1} title={<OverlayTrigger placement="top" overlay={exportTooltip}><FontAwesomeIcon icon='download' fixedWidth/></OverlayTrigger>} id="export-dropdown" pullRight>
            <MenuItem key="toJSONHeader" eventKey={1.1} header>JSON format</MenuItem>
            <MenuItem key="toJSONAll" eventKey={1.2} onClick={ () => this.exportEventsWithAuxDataToJSON()}>Events w/aux data</MenuItem>
            <MenuItem key="toJSONEvents" eventKey={1.3} onClick={ () => this.exportEventsToJSON()}>Events Only</MenuItem>
            <MenuItem key="toJSONAuxData" eventKey={1.4} onClick={ () => this.exportAuxDataToJSON()}>Aux Data Only</MenuItem>
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

    if(this.props.event.fetching) {
      return (
        <Panel>
          <Panel.Heading>{ this.renderEventListHeader() }</Panel.Heading>
          <ListGroup>
            <ListGroupItem>Loading...</ListGroupItem>
          </ListGroup>
        </Panel>
      )
    } else if(this.props.event && this.props.event.events.length > 0) {

      let eventList = (this.state.hideASNAP)? this.props.event.events.filter(event => (event.event_value != "ASNAP")) : this.props.event.events

      if(eventList.length == 0){
        return (
          <Panel>
            <Panel.Heading>{ this.renderEventListHeader() }</Panel.Heading>
            <ListGroup>
              <ListGroupItem>No events found!</ListGroupItem>
            </ListGroup>
          </Panel>
        )
      }

      // console.log(this.props.event.selected_event)

      return (          
        <Panel>
          <Panel.Heading>{ this.renderEventListHeader() }</Panel.Heading>
          <ListGroup>
            {
              eventList.map((event, index) => {
                if(index >= (this.state.activePage-1) * 7 && index < (this.state.activePage * 7)) {
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
                  let commentTooltip = (<Tooltip id={`commentTooltip_${event.id}`}>Edit/View Comment</Tooltip>)
                  let eventDetailsTooltip = (<Tooltip id={`commentTooltip_${event.id}`}>View Event Details</Tooltip>)
                  let active = (this.props.event.selected_event.id == event.id)? true : false
                  // onClick={() => this.handleEventClick(event.id)} active={active}
                  
                  return (
                  //<ListGroupItem key={event.id} active={active} ><span onClick={() => this.handleEventShowDetails(event.id)}>{`${event.ts} <${event.event_author}>: ${event.event_value} ${eventOptions}`}</span><span className="pull-right" onClick={() => this.handleEventComment(event.id)}><OverlayTrigger placement="top" overlay={commentTooltip}><FontAwesomeIcon icon='comment' fixedWidth/></OverlayTrigger></span></ListGroupItem>
                    <ListGroupItem key={event.id} active={active} ><span onClick={() => this.handleEventClick(index)} >{`${event.ts} <${event.event_author}>: ${event.event_value} ${eventOptions}`}</span><span className="pull-right" onClick={() => this.handleEventComment(index)}><OverlayTrigger placement="top" overlay={commentTooltip}><FontAwesomeIcon icon='comment' fixedWidth/></OverlayTrigger></span></ListGroupItem>
                  )
                }
              })
            }
          </ListGroup>
        </Panel>
      );
    } else {
      return (
        <Panel>
          <Panel.Heading>{ this.renderEventListHeader() }</Panel.Heading>
          <Panel.Body>No events found!</Panel.Body>
        </Panel>
      )
    }
  }

  renderPagination() {
    const maxEventsPerPage = 7

    if(!this.props.event.fetching && this.props.event.events.length > 0) {
      let eventCount = this.props.event.events.length
      let last = Math.ceil(eventCount/maxEventsPerPage);
      let delta = 2
      let left = this.state.activePage - delta
      let right = this.state.activePage + delta + 1
      let range = []
      let rangeWithDots = []
      let l = null

      for (let i = 1; i <= last; i++) {
        if (i == 1 || i == last || i >= left && i < right) {
            range.push(i);
        }
      }

      for (let i of range) {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(<Pagination.Item key={l + 1} active={(this.state.activePage === l+1)} onClick={() => this.setState({activePage: (l + 1)})}>{l + 1}</Pagination.Item>)
          } else if (i - l !== 1) {
            rangeWithDots.push(<Pagination.Ellipsis key={`ellipsis_${i}`} />);
          }
        }
        rangeWithDots.push(<Pagination.Item key={i} active={(this.state.activePage === i)} onClick={() => this.setState({activePage: i})}>{i}</Pagination.Item>);
        l = i;
      }

      return (
        <Pagination>
          <Pagination.First onClick={() => this.setState({activePage: 1})} />
          <Pagination.Prev onClick={() => { if(this.state.activePage > 1) { this.setState(prevState => ({ activePage: prevState.activePage-1}))}}} />
          {rangeWithDots}
          <Pagination.Next onClick={() => { if(this.state.activePage < last) { this.setState(prevState => ({ activePage: prevState.activePage+1}))}}} />
          <Pagination.Last onClick={() => this.setState({activePage: last})} />
        </Pagination>
      )
    }
  }

  renderPopoutMapButton() {
    return (
      <Link to="#" onClick={ () => this.openMapWindow() }><Button disabled={this.props.event.fetching}>Open Map Window</Button></Link>
    )  
  }

  render(){
    return (
      <Grid fluid>
        <EventCommentModal />
        <Row>
          <Col lg={12}>
            <div>
              <Well bsSize="small">
                {`Replay`}{' '}
                <span className="pull-right">
                  <LinkContainer to={ `/search` }><Button disabled={this.props.event.fetching} bsSize={'xs'}>Goto Search</Button></LinkContainer>
                </span>
              </Well>
            </div>
          </Col>
        </Row>
        <Row>
          {this.renderAuxDataPanel()}
        </Row>
        <Row>
          <Col md={9} lg={9}>
            {this.renderControlsPanel()}
            {this.renderEventPanel()}
            {this.renderPagination()}
          </Col>          
          <Col md={3} lg={3}>
            <EventFilterForm disabled={this.props.event.fetching} hideASNAP={this.state.hideASNAP} handlePostSubmit={ () => { this.handleReplayPause();this.setState({ activePage: 1, replayEventIndex: 0 }) } } />
          </Col>          
        </Row>
      </Grid>
    )
  }
}

        // <Row>
          // <Col lg={12}>
            // {this.renderPopoutMapButton()}
          // </Col>
        // </Row>

function mapStateToProps(state) {
  return {
    roles: state.user.profile.roles,
    event: state.event
  }
}

export default connect(mapStateToProps, null)(Replay);
