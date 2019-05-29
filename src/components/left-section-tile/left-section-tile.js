import React from 'react';
import '../gauge/gauge';
// import {Donut} from '../gauge/gauge';
import {Doughnut} from '../gauge/gauge-extends'

import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { sum } from '../../services/helpers'
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../../constants/style';
import {CardHeader} from '../card-header';
import NumberCounter from '../number-counter/number-counter';
import { Card } from '../card/card';
import {getGaugeConfig} from './chart-config';

import { Icon } from '../icon';
import { toHtml } from '@fortawesome/fontawesome-svg-core';


const chart_text = {
    position: 'absolute',
    top: '20%',
    left: '0px',
    right: '0px',
    fontSize: '1rem'
}

class LeftSectionTile extends React.Component {

    constructor(props) {
        super(props);
        const { max, value } = this.props;

        this.state = {
            chart_data: this.getData(max, value),
            percent: max > 0 ? Math.floor((value * 100) / max) : 0
        };
        this.setCanvas = this.setCanvas.bind(this);
    }
    getData(max, value) {
        return [{
            value: value,
            color: PRIMARY_COLOR,
        },
        {
            value: (max - value) || 100,
            color: SECONDARY_COLOR,

        }]
    }

    componentWillReceiveProps(nextProps) {
        const { max, value } = nextProps;
        const percent = max > 0 ? Math.floor((value * 100) / max) : 0
        this.setState({
            chart_data: this.getData(max, value),
            percent
        });

        if(this.state.gauge) {
            this.state.gauge.maxValue = 100;
            const percent = max !=0 ? (value/max)*100 : 0;
            this.state.gauge.set(percent);
        }


    }


    render() {

        const { icon, value, max, enabled, icon_width, icon_height, fontLoaded } = this.props;
        return (
            <div style={{ height: '100%' }} className={enabled ? 'left_section_tile' : 'disabled_tile left_section_tile'}>
            <Card >
                {{ className: 'card-hover',
                    header: <CardHeader>
                        {{
                            icon: <Icon width={icon_width} height={icon_height} name={icon}></Icon>
                        }}
                    </CardHeader>,
                    content: fontLoaded? this.renderChart(): '',
                    footer: this.renderFooter(value, max)
                }}
            </Card>
            </div>

        )
    }

    renderChart() {
        return (
            <div style={{ position: 'relative' }}>
                <canvas ref={this.setCanvas} width="95" height="95" style={{width:'95px' , height: '95px'}} ></canvas>
            </div>
        );
    }

    setCanvas = (canvas) => {
        this.setUpChart(canvas);
    }
    getGaugeConfig() {
        const {chart_title} = this.props;
        const options =getGaugeConfig();
        options.title = chart_title;
        return options;
    }


    setUpChart(canvas) {
        var opts = this.getGaugeConfig();
        var gauge = new Doughnut(canvas).setOptions(opts); 
        gauge.maxValue = 100; 
        gauge.setMinValue(0); 
        gauge.set(0);
        this.setState({gauge});
    }

    renderFooter(value, maxValue) {
        return (
            <div>
                <NumberCounter to={value} speed={400}></NumberCounter> out of {maxValue}
            </div>
        )
    }
}



const getSumValue = (jobs, propertyName) => {
    let selectedJobs = jobs.filter(job => job.isSelected);
    return sum(selectedJobs.map(job => job[propertyName].value));
}

const getMaxSumValue = (jobs, propertyName) => {
    let selectedJobs = jobs.filter(job => job.isSelected);
    return sum(selectedJobs.map(job => job[propertyName].maxValue));
}
const mapStateToProps = (state, props) => (
    {
        value: getSumValue(state.jobs, props.propertyName),
        max: getMaxSumValue(state.jobs, props.propertyName),
        enabled: state.jobs.filter(job => job.isSelected).length>0,
        fontLoaded: state.fontConfig.loaded
    }
);


export default connect(mapStateToProps, null)(LeftSectionTile);
