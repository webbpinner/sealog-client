import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import { Button, ListGroup, ListGroupItem, Panel, Tooltip, OverlayTrigger } from 'react-bootstrap';
import * as actions from '../actions';
import fileDownload from 'react-file-download';

import $ from 'jquery';
//import { Client } from 'nes';

class EventList extends Component {

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

    if(this.props.list && this.props.list.length > 0){
      return this.props.list.map((message) => {

        let freeText = '';
        message.event_free_text ? freeText = ' --> ' + message.event_free_text : freeText = '';


        return (<ListGroupItem key={message.id}>{message.ts}: {message.user_name} - {message.event_value} {freeText}</ListGroupItem>);
      })      
    }

    return <ListGroupItem key="emptyEventList" >No events found</ListGroupItem>
  }

  render() {

    if (!this.props.list) {
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
    list: state.event.list,
    showEventList: state.event.showEventList,
    showEventListFullscreen: state.event.showEventListFullscreen
  }
}

export default connect(mapStateToProps, actions)(EventList);