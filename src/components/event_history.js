import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import { Button, ListGroup, ListGroupItem, Panel, Tooltip, OverlayTrigger } from 'react-bootstrap';
import * as actions from '../actions';
import $ from 'jquery';
import { Client } from 'nes';
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
    this.scrollToBottom = this.scrollToBottom.bind(this);
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
    
    this.client.connect(
      {
        auth: {
          headers: {
            authorization: cookies.get('token')
          }
        } 
      },
      (err) => {

        if(err) {
          console.log(err);
        }

        let handler = (update, flags) => {
          //console.log(update);
          if(!(this.state.hideASNAP && update.event_value == "ASNAP")) {
            this.props.updateEventHistory(update);
          }
        };

        this.client.subscribe('/ws/status/newEvents', handler, (err) => {
          if(err) {
            console.log(err);
          }
        })
      }
    )
  }

  componentWillUnmount() {
    if(this.props.authenticated) {
      this.client.disconnect();
    }
  }

  componentDidUpdate() {
    // this.scrollToBottom();
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
              <Button bsStyle="default" bsSize="xs" type="button" onClick={ () => this.handleHideEventHistoryFullscreen() }><OverlayTrigger placement="top" overlay={compressTooltip}><FontAwesome name='compress' fixedWidth/></OverlayTrigger></Button>
              <Button bsStyle="default" bsSize="xs" type="button" onClick={ () => this.handleHideEventHistory() }><OverlayTrigger placement="top" overlay={hideTooltip}><FontAwesome name='eye-slash' fixedWidth/></OverlayTrigger></Button>
            </div>
          </div>
        );
      }
      
      return (
        <div>
          { Label }
          <div className="pull-right">
            {ASNAPToggle}
            <Button bsStyle="default" bsSize="xs" type="button" onClick={ () => this.handleShowEventHistoryFullscreen() }><OverlayTrigger placement="top" overlay={expandTooltip}><FontAwesome name='expand' fixedWidth/></OverlayTrigger></Button>
            <Button bsStyle="default" bsSize="xs" type="button" onClick={ () => this.handleHideEventHistory() }><OverlayTrigger placement="top" overlay={hideTooltip}><FontAwesome name='eye-slash' fixedWidth/></OverlayTrigger></Button>
          </div>
        </div>
      );
    }

    return (
      <div>
        { Label }
        <div className="pull-right">
          <Button bsStyle="default" bsSize="xs" type="button" onClick={ () => this.handleShowEventHistory() }><OverlayTrigger placement="top" overlay={showTooltip}><FontAwesome name='eye' fixedWidth/></OverlayTrigger></Button>
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

  scrollToBottom() {
    const eventHistory = findDOMNode(this.refs.eventHistory);
    let desiredHeight = $(eventHistory).prop('scrollHeight');
    $(eventHistory).scrollTop(desiredHeight);
  }

  renderEventHistory() {

    if(this.props.history && this.props.history.length > 0){

      let eventArray = []

      for (let i = this.props.history.length; i > 0; i--) {

        let event = this.props.history[i-1]
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

        eventArray.push(<ListGroupItem key={event.id}>{event.ts} {`<${event.event_author}>`}: {event.event_value} {eventOptions}<span className="pull-right" onClick={() => this.handleEventComment(event.id)}><OverlayTrigger placement="top" overlay={commentTooltip}><FontAwesome name='comment' fixedWidth/></OverlayTrigger></span></ListGroupItem>);
      }
      return eventArray
    }

    return (<ListGroupItem key="emptyHistory" >No events found</ListGroupItem>)
  }

  render() {

    if (!this.props.history) {
      return (
        <Panel header={ this.renderEventHistoryHeader() }>
          <div>Loading...</div>
        </Panel>
      )
    }

    if (this.state.showEventHistory) {
      if (this.state.showEventHistoryFullscreen) {
        return (
          <Panel header={ this.renderEventHistoryHeader() }>
            <ListGroup fill ref="eventHistory">
              {this.renderEventHistory()}
            </ListGroup>
          </Panel>
        );
      }
    
      return (
        <Panel header={ this.renderEventHistoryHeader() }>
          <ListGroup fill className="eventHistory" ref="eventHistory">
            {this.renderEventHistory()}
          </ListGroup>
        </Panel>
      );
    }

    return (
        <Panel header={ this.renderEventHistoryHeader() }>
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