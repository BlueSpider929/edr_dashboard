import React from 'react';
import {Doughnut} from 'react-chartjs'

import { connect } from 'react-redux';
import {average, sum} from '../../services/helpers'

import {PRIMARY_COLOR, SECONDARY_COLOR} from '../../constants/style'
import NumberCounter from '../number-counter/number-counter';


const chart_text = {
    position: 'absolute',
    top: '20%',
    left: '0px',
    right: '0px',
    fontSize: '1rem'
}

class ApplicationStatus extends React.Component {
    
    constructor(props) {
        super(props);
        const {max, value} = this.props;

        this.state = {
            chart_data: this.getData(max, value),
            percent: max>0?Math.floor((value*100)/max): 0
        }
    }
    getData(max, value) {
        return [{
            value: value,
            color: PRIMARY_COLOR,
        },
        {
            value: max-value,
            color: SECONDARY_COLOR,
       
        }]
    }
    
    componentWillReceiveProps(nextProps) {
        const {max, value} = nextProps;
        const percent =max >0? Math.floor((value*100)/max): 0
        this.state = {
            chart_data: this.getData(max, value),
            percent
        }
    }

    render() {

        const {chart_title} = this.props;

       const {percent, chart_data} = this.state;
        return (
            <div style={{position: 'relative'}}>
            <div style={chart_text}>
                <span style={{fontSize:'8px'}}>{chart_title}</span>
                <span style={{display:'block'}}><NumberCounter to={percent} speed={1000}></NumberCounter> %</span>
            </div>
                <Doughnut data={chart_data} width="80%" height="80" options={{segmentStrokeWidth: 1,cutoutPercentage: 10, percentageInnerCutout: 85}}></Doughnut>
            </div>
        )
    }
} 



const getSumValue = (jobs, propertyName) => {
    let selectedJobs =  jobs.filter(job => job.isSelected);
    return sum(selectedJobs.map(job => job[propertyName].value));
}

const getMaxSumValue = (jobs, propertyName) => {
    let selectedJobs =  jobs.filter(job => job.isSelected);
    return sum(selectedJobs.map(job => job[propertyName].maxValue));
}
const mapStateToProps = (state, props) => (
    {
        value: getSumValue(state.jobs, props.propertyName),
        max: getMaxSumValue(state.jobs, props.propertyName)
    }
);

const mapDispatchToProps = (dispatch, ownProps) => ({
   
  })

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationStatus);
