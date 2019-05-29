
import $ from 'jquery'; 
import {Gauge} from '../gauge/gauge'
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {sum, average} from '../../services/helpers'
import { NumberCounter } from '../number-counter/number-counter';
import { RecoveryTimeGauge } from './recovery-time-gauge';
import { Card } from '../card/card';
import { CardHeader } from '../card-header';
import { Icon } from '../icon';

const R_STYLES = {
    container: {
        alignItems: 'center',
        height: "100%"
    },
    chart_container: {
    },
    value: {
        paddingTop: "10px",
        paddingBottom: "10px",     
        border: "1px solid",
        borderRadius: "10px",
        marginRight: "5%",
        marginLeft: "5%"
    
    },
    buttons:{
        position: 'absolute',
        bottom: "0px",
        left:"0px",
    },
    button: {
        
    }
}

export const METRIC = {
    MAX: 'Max',
    AVG: 'Avg'
}
class RecoveryTimeTile extends Component {


    constructor(props) {
        super(props);

            this.state={
                width: '80%',
                active_metric: METRIC.MAX,
                value: 0
            }
        this.showAvg = this.showAvg.bind(this);
        this.showMax = this.showMax.bind(this);
    }

    getMaxTTLValue() {
        const {maxTTLJob} = this.props;
        if(maxTTLJob) 
        return maxTTLJob.ttl.value;
    }
    getAvgTTL() {
        return this.props.avgValue;
    }
   
    showAvg() {
        this.setState({
            active_metric: METRIC.AVG,
            value: this.getAvgTTL()
        });
    }
    showMax() {
        this.setState({
            active_metric: METRIC.MAX,
            value: this.getMaxTTLValue()
        });
    }
    componentWillReceiveProps(nextProps) {
        const {avgValue, maxTTLJob} = nextProps;
        const maxTTL = maxTTLJob && maxTTLJob.ttl? maxTTLJob.ttl.value: 0;
        const {active_metric} = this.state;
        let newState = {
            value: active_metric === METRIC.AVG ? avgValue: maxTTL
        }

        this.setState(newState);
    }
    render() {
        const {avgValue, maxScaleValue, maxTTLJob, enabled} = this.props;

        const maxButtonClass= this.state.active_metric === METRIC.MAX ? 'active': '';
        const avgButtonClass= this.state.active_metric === METRIC.AVG ? 'active': ''
        return (
            <div style={{ height: '100%' }} className={enabled ? '' : 'disabled_tile'}>
            <Card>
                {{
                     className: 'card-hover',
                     header: <CardHeader>
                     {{
                       title: 'Time to Recover',
                       icon: <Icon width="25px" height="25px" name="sand_clock"></Icon>
                     }}
                   </CardHeader>,
                     content: <div style={R_STYLES.container} className="d-flex flex-col">                
             
                     <RecoveryTimeGauge chart_width={220} chart_height={110} maxValue={maxScaleValue} currentValue={this.state.value}></RecoveryTimeGauge>
                        <div style={R_STYLES.buttons} className="recovery_tile_button">
                                <div className="d-flex flex-col">
                                    <span className="question_mark">
                                        <FontAwesomeIcon icon="question-circle"></FontAwesomeIcon>
                                    </span>
                                    <div className="d-flex flex-row segment_button">
                                        <button onClick={this.showMax} className={maxButtonClass}>MAX</button>
                                        <button onClick={this.showAvg}  className={avgButtonClass}>AVG</button>
                                    </div>
                                    <div style={{minHeight: '25px'}}>
                                        {maxTTLJob? maxTTLJob.jobName: ''}
                                    </div>
                                </div>
                        </div>
                    </div>
                }}
            </Card>
            </div>
            
        )
    }
}

const getAvgValue = (jobs, propertyName) => {
    let selectedJobs = jobs.filter(job => job.isSelected);
    return average(selectedJobs.map(job => job[propertyName].value));
}

const getMaxSumValue = (jobs, propertyName) => {
    let selectedJobs = jobs.filter(job => job.isSelected);
    return sum(selectedJobs.map(job => job[propertyName].maxValue));
}

const getMaxTTLJob = (jobs) => {
    let selectedJobs = jobs.filter(job => job.isSelected);
    if(selectedJobs.length == 0) 
        {return null;}
    selectedJobs.sort((job1,job2) => job2.ttl.value - job1.ttl.value);  
    return selectedJobs[0];  
}
const mapStateToProps = (state, props) => (
    {
        avgValue: getAvgValue(state.jobs, 'ttl'),
        maxTTLJob: getMaxTTLJob(state.jobs),
        maxScaleValue: getMaxSumValue(state.jobs, 'ttl'),
        enabled: state.jobs.filter(job => job.isSelected).length>0
    }
);

const mapDispatchToProps = (dispatch, ownProps) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(RecoveryTimeTile);
