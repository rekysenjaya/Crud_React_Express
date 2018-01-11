import UserStore from './stores/UserStore';
import TodoApp from './components/routerApp.js';
import React from 'react';
import ReactDOM from 'react-dom';

const initialState = window.initialState && JSON.parse(window.initialState) || {};
console.log(initialState)

var userStore = UserStore.fromJS(initialState.users || []);
userStore.subscribeServerToStore();

ReactDOM.render(
	<TodoApp userStore={userStore} />,
	document.getElementById('appBody')
);

if (module.hot) {
  module.hot.accept('./components/routerApp', () => {
    var NewTodoApp = require('./components/routerApp').default;
    ReactDOM.render(
      <NewTodoApp userStore={userStore} />,
      document.getElementById('appBody')
    );
  });
}

