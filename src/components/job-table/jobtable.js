import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import createContextMenuRef from '../context-menu/context-menu'
import { selectAllJob, toggleJob } from '../../data/actions/job-action'
import { RecoveryTimeGauge } from '../recovery-time/recovery-time-gauge';
import { Card } from '../card/card';
import { CardHeader } from '../card-header';
import { Icon } from '../icon';
import { GAUGE_CONFIG } from './gauge-config';

const data = [
    {
        name: 'Application',
        readiness: 83,
    },
    {
        name: 'Databses',
        readiness: 70,
    },
    {
        name: 'Daily Test',
        readiness: 90,
    },
    {
        name: 'SAPCA',
        readiness: 88,
    },
    {
        name: 'Server',
        readiness: 75,
    }
]
class JobTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allJobSelected: false
        };
        this.toggleAllJobs = this.toggleAllJobs.bind(this);
    }

    toggleAllJobs() {
        const alJobSelected = !this.state.alJobSelected;
        this.setState({
            alJobSelected
        })
        this.props.selectAllJob(alJobSelected);
    }



    createContextMenu(job, event) {
        // event.preventDefault();
        // console.log(event);
        return ({ onClose }) => {
            return <div className="d-flex flex-col menu">
                <span className="menu_item" onClick={() => { this.runJob(job); onClose() }}>Edit Job</span>
                <span className="menu_item" onClick={() => { this.runJob(job); onClose() }}>Run Now</span>
                <span className="menu_item" onClick={() => { this.runJob(job); onClose() }}>Last Report</span>
                <span className="menu_item" onClick={() => { this.runJob(job); onClose() }}>Last Job Log</span>
            </div>
        }
    }

    runJob(job) {
        console.log('running job...', job);
    }


    render() {
        return <Card >
            {{
                header: <CardHeader>
                    {{
                        title: <div style={{ width: '100%', position: 'relative' }}>
                            <span className="job_table_button">Jobs</span>
                            <span className="job_table_button" style={{ position: 'absolute', right: '10px' }}>Report</span></div>,
                        icon: <Icon width="25px" height="25px"  name="report"></Icon>
                    }}
                </CardHeader>,
                content: <div>
                    <div className="d-flex" style={{ justifyContent: 'flex-start' }}>
                        <span className="select-wrapper">
                            <select className="filter-select">l̥
                      <option>Filter</option>
                            </select>
                        </span>

                    </div>
                    {this.getTable()}
                </div>
            }}
        </Card>
    }


    getTable() {
        const { jobs } = this.props;
        return <table className="job_table">
            <thead>
                <tr>
                    <th>
                        <input onChange={this.toggleAllJobs} type="checkbox"></input>
                    </th>
                    <th>
                        All
            </th>
                    <th>
                        <span style={{ color: 'transparent' }}>Some long text</span>
                    </th>
                    <th>Recovery Readiness</th>
                </tr>
            </thead>
            <tbody onContextMenu={() => { return false }}>
                {jobs.map((d, i) => {
                    return (<tr key={i} className="hover-row">
                        <td>
                            <input onChange={() => this.props.toggleJob(d)} checked={d.isSelected}
                                type="checkbox"></input>
                        </td>
                        <td ref={createContextMenuRef(this.createContextMenu(d))} >
                            <span>{d.jobName}</span>
                        </td>
                        <td>
                            <RecoveryTimeGauge options={GAUGE_CONFIG} hideValueContainer={true} displaySmall={true} chart_width="50px" chart_height="30px" maxValue={d.ttl.maxValue} currentValue={d.ttl.value}></RecoveryTimeGauge>
                        </td>
                        <td>
                            <span>{d.recoveryReadiness}%</span>
                        </td>
                    </tr>)
                })}
            </tbody>
        </table>

    }

}



const mapStateToProps = (state) => ({
    jobs: state.jobs
})

const mapDispatchToProps = (dispatch) => ({
    toggleJob: (job) => dispatch(toggleJob(job)),
    selectAllJob: (isSelected) => dispatch(selectAllJob(isSelected))
})
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(JobTable)