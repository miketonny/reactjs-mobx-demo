import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
// import io from 'socket.io-client';

import './index.css';
import Main from './Main';
import RootStore from './models/RootStore';

// const socket = io('http://localhost:3000');
// socket.on('connect', () => {
//     console.log('connected');
// });

ReactDOM.render((
  <Provider rootStore={new RootStore()}>
    <Main />
  </Provider>),
document.getElementById('root'));
