import React, { Component } from 'react';

import './App.css';
import { Header } from './components/header';
import { Card } from './components/card/card';
import RecoveryReadiness from './components/recovery-readiness/recovery-readinedd';
import { CardHeader } from './components/card-header';
import JobTable from './components/job-table/jobtable';
import MonthlyReadiness from './components/monthly-readiness/monthlyReadiness';
import NetworkReport from './components/network-report/network-report';
import ResourceAllocation from './components/resource-allocation/resource-allocation';
import RecoveryTimeTile from './components/recovery-time/recovery-time-report';
import LeftSectionTile from './components/left-section-tile/left-section-tile';

import './font-awesome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon } from './components/icon';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header></Header>
        <div className="main_container">
          <div className="left_section">
            <LeftSectionTile propertyName="applicationStatus" icon="application" icon_width="18px" icon_height="16px" chart_title="Application"></LeftSectionTile>
            <LeftSectionTile propertyName="databaseStatus" icon="database" icon_width="16px" icon_height="18px" chart_title="Database"></LeftSectionTile>
            <LeftSectionTile propertyName="advancedTestStatus" icon="cogs" icon_width="22px" icon_height="22px" chart_title="Advanced"></LeftSectionTile>
            <LeftSectionTile propertyName="serverStatus" icon="server" icon_width="15px" icon_height="15px" chart_title="Server"></LeftSectionTile>
          </div>

          <div className="main_section">
            <div className="d-flex flex-row" style={{ height: '50%' }}>
              <div className="flex-4" style={{minWidth:'400px'}}>
                <RecoveryReadiness></RecoveryReadiness>
              </div>
              <div className="flex-3" style={{minWidth:'270px'}}>

                <RecoveryTimeTile></RecoveryTimeTile>

              </div>
              <div className="flex-3" style={{minWidth:'270px'}}>
                <ResourceAllocation></ResourceAllocation>

              </div>


            </div>


            {/* second row */}

            <div className="d-flex flex-row" style={{ height: '50%' }}  >
              <div className="flex-4" style={{minWidth:'400px'}}>
              <JobTable></JobTable>
              </div>
              <div className="flex-3" style={{minWidth:'270px'}}>
                <MonthlyReadiness></MonthlyReadiness>
              </div>
              <div className="flex-3" style={{minWidth:'270px'}}>

                <NetworkReport></NetworkReport>

              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
