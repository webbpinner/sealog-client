import store from './store';
import { fetchEvents, fetchEventDefinitionsForChat } from './actions';

export function onChatEnter() {
  console.log("onChatEnter");
  store.dispatch(fetchEventDefinitionsForChat());
  store.dispatch(fetchEvents());
}