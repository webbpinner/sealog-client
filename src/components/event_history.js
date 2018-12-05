import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import { Button, ListGroup, ListGroupItem, Panel, Tooltip, OverlayTrigger } from 'react-bootstrap';
import * as actions from '../actions';
// import $ from 'jquery';
import { Client } from 'nes/client';
import Cookies from 'universal-cookie';
import { WS_ROOT_URL } from '../url_config';

const cookies = new Cookies();

class EventHistory extends Component {

  constructor (props) {
    super(props);

    this.state = {
      hideASNAP: true,
      showEventHistory: true,
      showEventHistoryFullscreen: false
    }

    this.client = new Client(`${WS_ROOT_URL}`);
    this.connectToWS = this.connectToWS.bind(this);
    // this.scrollToBottom = this.scrollToBottom.bind(this);
    // this.handleHideEventHistory = this.handleHideEventHistory.bind(this);
    // this.handleShowEventHistory = this.handleShowEventHistory.bind(this);
    // this.handleShowEventHistoryFullscreen = this.handleShowEventHistoryFullscreen.bind(this);

  }

  componentWillMount() {
    if(this.props.authenticated) {
      this.props.fetchEventHistory();
    }
  }

  componentDidMount() {
    this.connectToWS()
    
  }

  componentWillUnmount() {
    if(this.props.authenticated) {
      this.client.disconnect();
    }
  }

  componentDidUpdate() {
    // this.scrollToBottom();
  }

  async connectToWS() {

    try {
      const result = await this.client.connect(
      {
        auth: {
          headers: {
            authorization: cookies.get('token')
          }
        }
      })

      // console.log(result)

      const updateHandler = (update, flags) => {
        // console.log(update)
        if(!(this.state.hideASNAP && update.event_value == "ASNAP")) {
          this.props.updateEventHistory(update)
        }
      }

      const deleteHandler = (update, flags) => {
        // console.log(update)
        this.props.fetchEventHistory(this.state.hideASNAP)
      }

      this.client.subscribe('/ws/status/newEvents', updateHandler);
      this.client.subscribe('/ws/status/updateEvents', updateHandler);
      this.client.subscribe('/ws/status/deleteEvents', deleteHandler);

    } catch(error) {
      console.log(error);
      throw(error)
    }
  }

  handleEventShowDetails(id) {
    // console.log("id:", id)
    this.props.advanceLoweringReplayTo(id);
    this.props.showModal('eventShowDetails', { id: id });
  }

  handleEventComment(id) {
    this.props.showModal('eventComment', { id: id, handleUpdateEventComment: this.props.updateEventComment, handleHide: this.props.fetchEventHistory });
  }

  renderEventHistoryHeader() {

    const Label = "Event History"
    const expandTooltip = (<Tooltip id="editTooltip">Expand this panel</Tooltip>)
    const compressTooltip = (<Tooltip id="editTooltip">Compress this panel</Tooltip>)
    const showTooltip = (<Tooltip id="editTooltip">Show this panel</Tooltip>)
    const hideTooltip = (<Tooltip id="editTooltip">Hide this panel</Tooltip>)
    const toggleASNAPTooltip = (<Tooltip id="toggleASNAPTooltip">Show/Hide ASNAP Events</Tooltip>)

    const ASNAPToggleIcon = (this.state.hideASNAP)? "Show ASNAP" : "Hide ASNAP"
    const ASNAPToggle = (<Button bsSize="xs" onClick={() => this.toggleASNAP()}>{ASNAPToggleIcon}</Button>)


    if(this.state.showEventHistory) {

      if(this.state.showEventHistoryFullscreen) {
        return (
          <div>
            { Label }
            <div className="pull-right">
              {ASNAPToggle}
              <OverlayTrigger placement="top" overlay={compressTooltip}><Button bsStyle="default" bsSize="xs" type="button" onClick={ () => this.handleHideEventHistoryFullscreen() }><FontAwesomeIcon icon='compress' fixedWidth/></Button></OverlayTrigger>
              <OverlayTrigger placement="top" overlay={hideTooltip}><Button bsStyle="default" bsSize="xs" type="button" onClick={ () => this.handleHideEventHistory() }><FontAwesomeIcon icon='eye-slash' fixedWidth/></Button></OverlayTrigger>
            </div>
          </div>
        );
      }
      
      return (
        <div>
          { Label }
          <div className="pull-right">
            {ASNAPToggle}
            <OverlayTrigger placement="top" overlay={expandTooltip}><Button bsStyle="default" bsSize="xs" type="button" onClick={ () => this.handleShowEventHistoryFullscreen() }><FontAwesomeIcon icon='expand' fixedWidth/></Button></OverlayTrigger>
            <OverlayTrigger placement="top" overlay={hideTooltip}><Button bsStyle="default" bsSize="xs" type="button" onClick={ () => this.handleHideEventHistory() }><FontAwesomeIcon icon='eye-slash' fixedWidth/></Button></OverlayTrigger>
          </div>
        </div>
      );
    }

    return (
      <div>
        { Label }
        <div className="pull-right">
          <OverlayTrigger placement="top" overlay={showTooltip}><Button bsStyle="default" bsSize="xs" type="button" onClick={ () => this.handleShowEventHistory() }><FontAwesomeIcon icon='eye' fixedWidth/></Button></OverlayTrigger>
        </div>
      </div>
    );
  }


  handleHideEventHistory() {
    this.setState({showEventHistory: false});
  }

  handleShowEventHistory() {
    this.setState({showEventHistory: true});
  }

  handleHideEventHistoryFullscreen() {
    this.setState({showEventHistoryFullscreen: false});
  }

  handleShowEventHistoryFullscreen() {
    this.setState({showEventHistoryFullscreen: true});
  }

  toggleASNAP() {
    this.setState( prevState => ({hideASNAP: !prevState.hideASNAP}))
    this.props.fetchEventHistory(this.state.hideASNAP);
  }

  // scrollToBottom() {
  //   const eventHistory = findDOMNode(this.refs.eventHistory);
  //   let desiredHeight = $(eventHistory).prop('scrollHeight');
  //   $(eventHistory).scrollTop(desiredHeight);
  // }

  renderEventHistory() {

    if(this.props.history && this.props.history.length > 0){

      let eventArray = []

      // for (let i = this.props.history.length; i > 0; i--) {
      for (let i = 0; i < this.props.history.length; i++) {

        let event = this.props.history[i]
        let commentTooltip = (<Tooltip id={`commentTooltip_${event.id}`}>Add Comment</Tooltip>)

        // if(this.state.hideASNAP && event.event_value == "ASNAP") {
        //   continue
        // }

        let eventOptionsArray = [];
        event.event_options.map((option) => {
          if(option.event_option_name != 'event_comment') {
            eventOptionsArray.push(option.event_option_name.replace(/\s+/g, "_") + ": \"" + option.event_option_value + "\"");
          }
        })
        
        if (event.event_free_text) {
          eventOptionsArray.push("text: \"" + event.event_free_text + "\"")
        } 

        let eventOptions = (eventOptionsArray.length > 0)? '--> ' + eventOptionsArray.join(', '): ''

        eventArray.push(<ListGroupItem key={event.id}><span onClick={() => this.handleEventShowDetails(event.id)}>{event.ts} {`<${event.event_author}>`}: {event.event_value} {eventOptions}</span><span className="pull-right" onClick={() => this.handleEventComment(event.id)}><OverlayTrigger placement="top" overlay={commentTooltip}><FontAwesomeIcon icon='comment' fixedWidth/></OverlayTrigger></span></ListGroupItem>);
      }
      return eventArray
    }

    return (<ListGroupItem key="emptyHistory" >No events found</ListGroupItem>)
  }

  render() {

    if (!this.props.history) {
      return (
        <Panel>
          <Panel.Heading>{ this.renderEventHistoryHeader() }</Panel.Heading>
          <Panel.Body>Loading...</Panel.Body>
        </Panel>
      )
    }

    if (this.state.showEventHistory) {
      if (this.state.showEventHistoryFullscreen) {
        return (
          <Panel>
            <Panel.Heading>{ this.renderEventHistoryHeader() }</Panel.Heading>
            <ListGroup ref="eventHistory">
              {this.renderEventHistory()}
            </ListGroup>
          </Panel>
        );
      }
    
      return (
        <Panel>
          <Panel.Heading>{ this.renderEventHistoryHeader() }</Panel.Heading>
          <ListGroup className="eventHistory" ref="eventHistory">
            {this.renderEventHistory()}
          </ListGroup>
        </Panel>
      );
    }

    return (
        <Panel>
          <Panel.Heading>{ this.renderEventHistoryHeader() }</Panel.Heading>
        </Panel>
    );
  }
}

function mapStateToProps(state) {

  return {
    authenticated: state.auth.authenticated,
    history: state.event_history.history,
  }
}

export default connect(mapStateToProps, actions)(EventHistory);
