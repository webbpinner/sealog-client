import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import { Button, ListGroup, ListGroupItem, Panel, Tooltip, OverlayTrigger } from 'react-bootstrap';
import * as actions from '../actions';
import fileDownload from 'react-file-download';

import $ from 'jquery';
//import { Client } from 'nes';

class EventFilteredList extends Component {

  constructor (props) {
    super(props);

//    this.client = new Client('ws://localhost:8001');
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.handleExportEventList = this.handleExportEventList.bind(this);
    this.handleShowEventList = this.handleShowEventList.bind(this);
    this.handleShowEventListFullscreen = this.handleShowEventListFullscreen.bind(this);

  }

  componentWillMount() {
    if(this.props.authenticated) {
      this.props.fetchFilteredEvents();
    }
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  renderEventListHeader() {

    const Label = "Events"
    const expandTooltip = (<Tooltip id="editTooltip">Expand this panel</Tooltip>)
    const shrinkTooltip = (<Tooltip id="deleteTooltip">Shrink this panel</Tooltip>)
    const exportTooltip = (<Tooltip id="deleteTooltip">Export these events</Tooltip>)


    if(this.props.showEventListFullscreen) {
      return (
        <div>
          { Label }
          <div className="pull-right">
            <Button bsStyle="default" bsSize="xs" type="button" onClick={ this.handleShowEventList }><OverlayTrigger placement="top" overlay={shrinkTooltip}><FontAwesome name='compress' fixedWidth/></OverlayTrigger></Button>
            <Button bsStyle="default" bsSize="xs" type="button" onClick={ this.handleExportEventList }><OverlayTrigger placement="top" overlay={exportTooltip}><FontAwesome name='download' fixedWidth/></OverlayTrigger></Button>
          </div>
        </div>
      );
    }

    return (
      <div>
        { Label }
        <div className="pull-right">
          <Button bsStyle="default" bsSize="xs" type="button" onClick={ this.handleShowEventListFullscreen }><OverlayTrigger placement="top" overlay={expandTooltip}><FontAwesome name='expand' fixedWidth/></OverlayTrigger></Button>
          <Button bsStyle="default" bsSize="xs" type="button" onClick={ this.handleExportEventList }><OverlayTrigger placement="top" overlay={exportTooltip}><FontAwesome name='download' fixedWidth/></OverlayTrigger></Button>
        </div>
      </div>
    );
  }


  handleExportEventList() {
    fileDownload(JSON.stringify(this.props.list, null, "\t"), 'export.json');
  }

  handleShowEventList() {
    this.props.showEvents();
  }

  handleShowEventListFullscreen() {
    this.props.showEventsFullscreen();
  }

  scrollToBottom() {
    const eventList = findDOMNode(this.refs.eventList);
    let desiredHeight = $(eventList).prop('scrollHeight');
    $(eventList).scrollTop(desiredHeight);
  }

  renderEventList() {

    if(this.props.eventList && this.props.eventList.length > 0){
      return this.props.eventList.map((event) => {

        let freeText = (event.event_free_text.length > 0)? ` --> "${event.event_free_text}"` : ''
        
        let eventOptions = '';
        if (event.event_options.length > 0 ) {
          let eventOptionsObj = {};
          event.event_options.map((option) => {
            eventOptionsObj[option.event_option_name] = option.event_option_value;
          })
          eventOptions = JSON.stringify(eventOptionsObj)
        }

        return (<ListGroupItem key={event.id}>{`${event.ts} <${event.event_author}>: ${event.event_value} ${eventOptions} ${freeText}`}</ListGroupItem>);
      })      
    }

    return <ListGroupItem key="emptyEventList" >No events found</ListGroupItem>
  }

  render() {

    if (!this.props.eventList) {
      return (
        <Panel header={ this.renderEventListHeader() }>
          <div>Loading...</div>
        </Panel>
      )
    }

    if (this.props.showEventListFullscreen) {
      return (
        <Panel header={ this.renderEventListHeader() }>
          <ListGroup fill ref="eventList">
            {this.renderEventList()}
          </ListGroup>
        </Panel>
      );
    }
    
    if (this.props.showEventList) {
      return (
        <Panel header={ this.renderEventListHeader() }>
          <ListGroup fill className="eventList" ref="eventList">
            {this.renderEventList()}
          </ListGroup>
        </Panel>
      );
    }

    return (
        <Panel header={ this.renderEventListHeader() }>
        </Panel>
    );
  }
}

function mapStateToProps(state) {

  return {
    authenticated: state.auth.authenticated,
    eventList: state.event.events,
    showEventList: state.event.showEvents,
    showEventListFullscreen: state.event.showEventsFullscreen
  }
}

export default connect(mapStateToProps, actions)(EventFilteredList);