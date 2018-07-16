import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import io from 'socket.io-client';
import './App.css';
import Form from './components/Form';
import GroupBox from './components/GroupBox';
import Modal from './components/Modal';
import EndTrimForm from './components/EndTrimForm';
import Table from './components/Table';
import Control from './components/StreamControl';
import Header from './components/StreamHeader';
import MetricTable from './components/MetricTable';
import ProgressTable from './components/ProgressTable';
import AllMetricSelection from './components/AllMetricSelection';
import ProgMetricSelection from './components/ProgressiveMetricSelection';


@inject('rootStore')
@observer
class App extends Component {
    /*
    Component state change events =====================================
    */
   constructor(props) {
       super(props);
       const { rootStore } = this.props;
       this.root = rootStore;
       this.showAllSplits = this.showAllSplits.bind(this);
       this.handleAddSplit = this.handleAddSplit.bind(this);
       this.handleOverlay = this.handleOverlay.bind(this);
   }

    // API looping call =============
    componentDidMount() {
        // api call to fetch athlete data from server DB every 5 sec............
        // setInterval(() => this.props.rootStore.data.getData(), 5000);
        const socket = io('http://localhost:3000');
        const { sessionID } = this.root.ui;
        console.log(sessionID);
        socket.on('connect', () => {
          console.log('connected');
          socket.emit('join', sessionID, (err) => {
            // console.log(err);
          });
          socket.on('datarefresh', (data) => {
            this.root.data.refreshAllMetricData(data.allAthData);
            this.root.data.getLiveTagData(data.liveTagData);
          });
        });
    }

    handleAddSplit() {
        this.root.ui.addSplit();
    }

    showAllSplits() {
        this.root.ui.showAllSplits();
    }

        // hanle overlay clicks to hide modal when not clicked on modal
    handleOverlay(e) {
        this.root.ui.handleOverlay(e);
    }

    render() {
        const loading = this.root.isLoading;
        // if your component doesn't have to wait for an async action, remove this block
        if (loading) {
            return (
              <div id="tableLoading" className="text-center loading-spinner spinner"><span>Loading please hold...</span>
              </div>
                );
        }
        let tbl;
        switch (this.root.ui.currentTable) {
            case 'Metric':
                tbl = <MetricTable />;
                break;
            case 'Progress':
                tbl = <ProgressTable />;
                break;
            case 'LiveTag':
                tbl = (
                  <div>
                    <div className="col-md-12">
                      <div className="control-buttons pull-right">
                        <button type="button" className="btn" onClick={this.showAllSplits}>Show All</button>
                        <button type="button" className="btn" onClick={this.handleAddSplit}>Add Split</button>
                      </div>
                    </div>
                    <div className="col-md-2"><GroupBox
                      groups={this.root.positionalGroups}
                      positions={this.root.positions}
                      statusGrps={this.root.statusGroups}
                    />
                    </div>
                    <Table columns={this.root.data.data} />
                  </div>
);
                break;
            default:
                break;
        }
        return (
          <div
            className="App row"
            data-test="component-app"
            onClick={this.handleOverlay}
            onKeyDown={this.handleOverlay}
          >
            <Header />
            <Control />
            {tbl}
            <Modal
              show={this.root.ui.showAddSplit}
              inner={<Form />}
            />
            <Modal
              show={this.root.ui.showEndTrim}
              inner={<EndTrimForm name={this.root.ui.currentTrimName} />}
            />
            <Modal
              show={this.root.ui.showMetricsModal}
              inner={<AllMetricSelection />}
            />
            <Modal
              show={this.root.ui.showProgressiveModal}
              inner={<ProgMetricSelection />}
            />
          </div>
                );
    }
}


export default App;
