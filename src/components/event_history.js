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

    this.client = new Client(`${WS_ROOT_URL}`);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.handleHideEventHistory = this.handleHideEventHistory.bind(this);
    this.handleShowEventHistory = this.handleShowEventHistory.bind(this);
    this.handleShowEventHistoryFullscreen = this.handleShowEventHistoryFullscreen.bind(this);

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
          this.props.updateEventHistory(update);
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

  renderEventHistoryHeader() {

    const Label = "Event History"
    const expandTooltip = (<Tooltip id="editTooltip">Expand this panel</Tooltip>)
    const compressTooltip = (<Tooltip id="editTooltip">Compress this panel</Tooltip>)
    const showTooltip = (<Tooltip id="editTooltip">Show this panel</Tooltip>)
    const hideTooltip = (<Tooltip id="editTooltip">Hide this panel</Tooltip>)

    if(this.props.showEventHistoryFlag && !this.props.showEventHistoryFullscreenFlag) {
      return (
        <div>
          { Label }
          <div className="pull-right">
            <Button bsStyle="default" bsSize="xs" type="button" onClick={ this.handleShowEventHistoryFullscreen }><OverlayTrigger placement="top" overlay={expandTooltip}><FontAwesome name='expand' fixedWidth/></OverlayTrigger></Button>
            <Button bsStyle="default" bsSize="xs" type="button" onClick={ this.handleHideEventHistory }><OverlayTrigger placement="top" overlay={hideTooltip}><FontAwesome name='eye-slash' fixedWidth/></OverlayTrigger></Button>
          </div>
        </div>
      );
    }

    if(this.props.showEventHistoryFlag && this.props.showEventHistoryFullscreenFlag) {
      return (
        <div>
          { Label }
          <div className="pull-right">
            <Button bsStyle="default" bsSize="xs" type="button" onClick={ this.handleShowEventHistory }><OverlayTrigger placement="top" overlay={compressTooltip}><FontAwesome name='compress' fixedWidth/></OverlayTrigger></Button>
            <Button bsStyle="default" bsSize="xs" type="button" onClick={ this.handleHideEventHistory }><OverlayTrigger placement="top" overlay={hideTooltip}><FontAwesome name='eye-slash' fixedWidth/></OverlayTrigger></Button>
          </div>
        </div>
      );
    }

    return (
      <div>
        { Label }
        <div className="pull-right">
          <Button bsStyle="default" bsSize="xs" type="button" onClick={ this.handleShowEventHistory }><OverlayTrigger placement="top" overlay={showTooltip}><FontAwesome name='eye' fixedWidth/></OverlayTrigger></Button>
        </div>
      </div>
    );
  }


  handleHideEventHistory() {
    this.props.hideEventHistory();
  }

  handleShowEventHistory() {
    this.props.showEventHistory();
  }

  handleShowEventHistoryFullscreen() {
    this.props.showEventHistoryFullscreen();
  }

  scrollToBottom() {
    const eventHistory = findDOMNode(this.refs.eventHistory);
    let desiredHeight = $(eventHistory).prop('scrollHeight');
    $(eventHistory).scrollTop(desiredHeight);
  }

  renderEventHistory() {
    if(this.props.history && this.props.history.length > 0){

      let messageArray = []

      for (let i = this.props.history.length; i > 0; i--) {

        let message = this.props.history[i-1]
        let freeText = '';
        message.event_free_text ? freeText = ` --> "${message.event_free_text}"` : freeText = '';

        let eventOptions = '';
        if (message.event_options.length > 0 ) {
          let eventOptionsObj = {};
          message.event_options.map((option) => {
            eventOptionsObj[option.event_option_name] = option.event_option_value;
          })
          eventOptions = JSON.stringify(eventOptionsObj)
        }

        messageArray.push(<ListGroupItem key={message.id}>{message.ts} {`<${message.event_author}>`}: {message.event_value} {eventOptions} {freeText}</ListGroupItem>);
      }
      return messageArray
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

    if (this.props.showEventHistoryFullscreenFlag) {
      return (
        <Panel header={ this.renderEventHistoryHeader() }>
          <ListGroup fill ref="eventHistory">
            {this.renderEventHistory()}
          </ListGroup>
        </Panel>
      );
    }
    
    if (this.props.showEventHistoryFlag) {
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
    showEventHistoryFlag: state.event_history.showEventHistory,
    showEventHistoryFullscreenFlag: state.event_history.showEventHistoryFullscreen
  }
}

export default connect(mapStateToProps, actions)(EventHistory);