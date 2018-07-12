import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

import './index.css';
import Main from './Main';
import rootStore from './models/RootStore';



ReactDOM.render((
    <Provider  rootStore={new rootStore()}>
        <Main />
    </Provider>), 
document.getElementById('root'));

