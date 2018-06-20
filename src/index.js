import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import './index.css';
import App from './App';
import rootStore from './models/RootStore';

//import registerServiceWorker from './registerServiceWorker';

// const stores = {
//     rootStore
// };

ReactDOM.render((
    <Provider  rootStore={new rootStore()}>
        <App />
    </Provider>), 
document.getElementById('root')); 
//registerServiceWorker();
