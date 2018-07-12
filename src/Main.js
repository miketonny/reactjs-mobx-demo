import React, { Component } from 'react'; 
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react'; 
import Landing from './components/Landing';
import App from './App';

@inject('rootStore')
@observer
class Main extends Component {
    render(){
        return (
            <Router basename="/">
              <div>
               <Route exact path="/" component={Landing} />
               <Route exact path="/stream" component={App} />
               </div>
            </Router>
        );
    }
}

export default Main;