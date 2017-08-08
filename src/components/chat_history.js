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

class ChatHistory extends Component {

  constructor (props) {
    super(props);

    this.client = new Client(`${WS_ROOT_URL}`);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.handleHideChat = this.handleHideChat.bind(this);
    this.handleShowChat = this.handleShowChat.bind(this);
    this.handleShowChatFullscreen = this.handleShowChatFullscreen.bind(this);

  }

  componentWillMount() {
    if(this.props.authenticated) {
      this.props.fetchEvents();
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
          this.props.updateChat(update);
        };

        this.client.subscribe('/chat/updates', handler, (err) => {
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
    this.scrollToBottom();
  }

  renderChatHistoryHeader() {

    const Label = "Event History"
    const expandTooltip = (<Tooltip id="editTooltip">Expand this panel</Tooltip>)
    const compressTooltip = (<Tooltip id="editTooltip">Compress this panel</Tooltip>)
    const showTooltip = (<Tooltip id="editTooltip">Show this panel</Tooltip>)
    const hideTooltip = (<Tooltip id="editTooltip">Hide this panel</Tooltip>)

    if(this.props.showChatHistory && !this.props.showChatHistoryFullscreen) {
      return (
        <div>
          { Label }
          <div className="pull-right">
            <Button bsStyle="default" bsSize="xs" type="button" onClick={ this.handleShowChatFullscreen }><OverlayTrigger placement="top" overlay={expandTooltip}><FontAwesome name='expand' fixedWidth/></OverlayTrigger></Button>
            <Button bsStyle="default" bsSize="xs" type="button" onClick={ this.handleHideChat }><OverlayTrigger placement="top" overlay={hideTooltip}><FontAwesome name='eye-slash' fixedWidth/></OverlayTrigger></Button>
          </div>
        </div>
      );
    }

    if(this.props.showChatHistory && this.props.showChatHistoryFullscreen) {
      return (
        <div>
          { Label }
          <div className="pull-right">
            <Button bsStyle="default" bsSize="xs" type="button" onClick={ this.handleShowChat }><OverlayTrigger placement="top" overlay={compressTooltip}><FontAwesome name='compress' fixedWidth/></OverlayTrigger></Button>
            <Button bsStyle="default" bsSize="xs" type="button" onClick={ this.handleHideChat }><OverlayTrigger placement="top" overlay={hideTooltip}><FontAwesome name='eye-slash' fixedWidth/></OverlayTrigger></Button>
          </div>
        </div>
      );
    }

    return (
      <div>
        { Label }
        <div className="pull-right">
          <Button bsStyle="default" bsSize="xs" type="button" onClick={ this.handleShowChat }><OverlayTrigger placement="top" overlay={showTooltip}><FontAwesome name='eye' fixedWidth/></OverlayTrigger></Button>
        </div>
      </div>
    );
  }


  handleHideChat() {
    this.props.hideChat();
  }

  handleShowChat() {
    this.props.showChat();
  }

  handleShowChatFullscreen() {
    this.props.showChatFullscreen();
  }

  scrollToBottom() {
    const chatHistory = findDOMNode(this.refs.chatHistory);
    let desiredHeight = $(chatHistory).prop('scrollHeight');
    $(chatHistory).scrollTop(desiredHeight);
  }

  renderChatHistory() {
    if(this.props.history){
      return this.props.history.map((message) => {

        let freeText = '';
        message.event_free_text ? freeText = ' --> ' + message.event_free_text : freeText = '';


        return (<ListGroupItem key={message.id}>{message.ts}: {message.user_name} - {message.event_value} {freeText}</ListGroupItem>);
      })      
    }

    return <ListGroupItem key="emptyHistory" >No chat messages</ListGroupItem>
  }

  render() {

    if (!this.props.history) {
      return (
        <Panel header={ this.renderChatHistoryHeader() }>
          <div>Loading...</div>
        </Panel>
      )
    }

    if (this.props.showChatHistoryFullscreen) {
      return (
        <Panel header={ this.renderChatHistoryHeader() }>
          <ListGroup fill ref="chatHistory">
            {this.renderChatHistory()}
          </ListGroup>
        </Panel>
      );
    }
    
    if (this.props.showChatHistory) {
      return (
        <Panel header={ this.renderChatHistoryHeader() }>
          <ListGroup fill className="chatHistory" ref="chatHistory">
            {this.renderChatHistory()}
          </ListGroup>
        </Panel>
      );
    }

    return (
        <Panel header={ this.renderChatHistoryHeader() }>
        </Panel>
    );
  }
}

function mapStateToProps(state) {

  return {
    authenticated: state.auth.authenticated,
    history: state.chat.history,
    showChatHistory: state.chat.showChat,
    showChatHistoryFullscreen: state.chat.showChatFullscreen
  }
}

export default connect(mapStateToProps, actions)(ChatHistory);