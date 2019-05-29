
import React from 'react';
import PropTypes from 'prop-types';

import NumberCounter from '../number-counter/number-counter';
import {Gauge} from '../gauge/gauge'
import {NewGauge} from '../gauge/gauge-extends'
import {getGaugeConfig} from './gauge-chart.config';
import { PRIMARY_COLOR } from '../../constants/style';


const R_STYLES = {
    chart_container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    value: {
        paddingTop: "4px",
        paddingBottom: "10px",     
        border: "1px solid",
        borderRadius: "10px",
        marginRight: "5%",
        marginLeft: "5%",
        color: PRIMARY_COLOR,
        fontSize: '34px',
        lineHeight:'0.8',
        maxWidth:'80%',
        overflow: 'hidden'
    
    },
    value_small: {
        paddingTop: "0",
        paddingBottom: "0",     
        border: "1px solid",
        borderRadius: "5px",
        fontSize: '5px'
    }
}

export class RecoveryTimeGauge extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            width: '80%',
            canvas: null,
            gauge: null
        }
        this.setCanvas = this.setCanvas.bind(this);
    }

    setCanvas = (canvas) => {
        this.setState({width: canvas.width *0.8, canvas});
        this.setUpChart(canvas);
    }
    getGaugeConfig() {
        return this.props.options || getGaugeConfig()
    }   


    setUpChart(canvas) {
        var opts = this.getGaugeConfig();
        var gauge = new NewGauge(canvas).setOptions(opts); 
        gauge.maxValue = this.props.maxValue || 100; 
        gauge.setMinValue(0); 
        gauge.set(this.props.currentValue || 0);
        this.setState({gauge});
    }
    
 

    componentWillReceiveProps(nextProps) {
      
            if(this.state.gauge) {
                const gauge = this.state.gauge;

                let max = this.props.maxValue*100/60;
                 gauge.maxValue = max*60 || 60;
                 gauge.set(nextProps.currentValue*60);
               }
        
    }
    render() {
        let {currentValue, maxValue} = this.props;
        let {chart_width, chart_height, displaySmall, hideValueContainer } =  this.props;
        let chart_style;
        let value_style = displaySmall? R_STYLES.value_small : R_STYLES.value;
        let value_container_width = this.state.canvas? (0.54*this.state.canvas.width) : '80%';
        if(chart_width || chart_height) {
            chart_style = {width: chart_width, height: chart_height};
            // value_style = R_STYLES.value_small;
            value_container_width = (0.8*chart_width);
        }
        
        return (
            <div style={R_STYLES.chart_container}>
                <div>
                    <canvas style={chart_style} ref={this.setCanvas}></canvas>
                </div>
                {/* {!hideValueContainer?<div className="recovery_tile value" style={{ width: value_container_width, ...value_style }}>
                    <NumberCounter digits={2} to={currentValue} speed={3500}></NumberCounter>/{maxValue}
                    <span style={{color: '#b0b1b1', fontWeight:'bold'}}>hr</span>
                </div>: ''} */}
            </div>
        );

    }
}


    RecoveryTimeGauge.propTypes = {
        maxValue: PropTypes.number,
        currentValue: PropTypes.number
    }