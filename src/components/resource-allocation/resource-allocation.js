import React from 'react';
import { connect } from 'react-redux';
import { PRIMARY_COLOR } from '../../constants/style'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import 'react-rangeslider/lib/index.css'
import Slider from 'react-rangeslider'

import { sum, average } from '../../services/helpers'
import { Card } from '../card/card';
import { CardHeader } from '../card-header'
import { Icon } from '../icon';

const SliderStyle = {
    width: '100%'
}
const SLIDER = ({ value, max }) => {
    return (<input className="slider" type="range" style={SliderStyle} max={max} value={value}></input>)
}
const STATUS_TYPE = {
    OK: 'OK',
    WARNING: 'Warning',
    DANGER: 'Danger'
}

class ResourceAllocation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: STATUS_TYPE.OK
        };
    }

    componentWillReceiveProps(nextProps) {
        const status = this.getStatus(nextProps);
        this.setState({ status });
    }
    getStatus(props) {
        if (!props.enabled)
            return STATUS_TYPE.OK;

        const params = props.params;
        let cpuPercent = params.cpu.value / params.cpu.maxValue;
        let iopsPercent = params.iops.value / params.iops.maxValue;
        let ramPercent = params.ram.value / params.ram.maxValue;
        let avg = (cpuPercent + iopsPercent + ramPercent) / 3;

        if (avg > 0.95)
            return STATUS_TYPE.DANGER;
        if (cpuPercent > 0.8 || iopsPercent > 0.8 || ramPercent > 0.8)
            return STATUS_TYPE.WARNING;

        return STATUS_TYPE.OK;

    }
    render() {
        const { enabled, params } = this.props;
        const status = this.state.status;

        return (
            <div style={{ height: '100%' }} className={enabled ? '' : 'disabled_tile'}>
                <Card>
                    {{
                        className: 'card-hover',
                        header: <CardHeader>
                            {{
                                title: 'Resource Allocation',
                                icon: <Icon width={25} height={25} name="pie_chart"></Icon>
                            }}
                        </CardHeader>,
                        content:
                            <div>
                                <table className="resource_table" style={{ color: PRIMARY_COLOR, margin: '10px', width: 'calc(100% - 20px)' }}>
                                    <tbody>
                                        {this.renderRow('IOPS', params.iops.value, params.iops.maxValue, 'iops',1000, 0)}
                                        {this.renderRow('CPU', params.cpu.value, params.cpu.maxValue, 'Ghz', 1024, 2)}
                                        {this.renderRow('RAM', params.ram.value, params.ram.maxValue, 'Gb', 1024, 2)}
                                    </tbody>
                                </table>
                                {enabled?this.getStatusIcon(status):''}
                            </div>

                    }}
                </Card>
            </div>

        );
    }

    renderRow(name, value, maxValue, unit, conversionFactor=1, decimals = 0) {
        return <tr>
            <td style={{ width: '35%' }}>
                <div className="d-flex flex-col" style={{color: '#585859'}}>
                    <span>{name}</span>
                    <span style={{ fontSize: '8px', color: '#585859' }}>Capacity {(maxValue/conversionFactor).toFixed(decimals)} {unit}</span>
                </div></td>
            <td>
                <div className="d-flex flex-col" style={{position: 'relative', top: '-5px'}}>
                    <Slider value={value} max={maxValue || 10} orientation='horizontal' tooltip={false}></Slider>
                    <div className="d-flex flex-row" style={{justifyContent: 'space-between'}}>
                        <span style={{ fontSize: '8px' }}> Used {(value/conversionFactor).toFixed(decimals)} {unit}</span>
                        <span style={{ fontSize: '8px', color: '#b0b1b1' }}>Free {((maxValue-value)/conversionFactor).toFixed(decimals)} {unit}</span>

                    </div>
                </div>
            </td>
        </tr>

    }
    getStatusIcon(status) {
        switch (status) {
            case STATUS_TYPE.OK:
                return <FontAwesomeIcon icon="check-circle2" style={{ color: '#82c341', fontSize: "5rem" }}></FontAwesomeIcon>
            case STATUS_TYPE.DANGER:
                return <FontAwesomeIcon icon="times" style={{ color: "#dd484d", fontSize: "5rem" }}></FontAwesomeIcon>
            case STATUS_TYPE.WARNING:
                return <FontAwesomeIcon icon="exclamation-triangle" style={{ color: "#fcb914", fontSize: "5rem" }}></FontAwesomeIcon>

        }
    }
}



// jobs contains resource info in array [IOPS, CPU, RAM]
// this function will calculate sum of IOPS, CPU, RAM for each job
// returns { iops: {value, maxValue}, cpu: {value, maxValue}, ram: {value, maxValue}}
const getAllParams = (jobs) => {
    const retValue = {
        cpu: {
            value: 0,
            maxValue: 0
        },
        iops: {
            value: 0,
            maxValue: 0
        },
        ram: {
            value: 0,
            maxValue: 0
        }
    };

    jobs.filter(job => job.isSelected).forEach(job => {
        retValue.iops.value += job.resourceAllocation[0].value;
        retValue.iops.maxValue += job.resourceAllocation[0].maxValue;

        retValue.cpu.value += job.resourceAllocation[1].value;
        retValue.cpu.maxValue += job.resourceAllocation[1].maxValue;

        retValue.ram.value += job.resourceAllocation[2].value;
        retValue.ram.maxValue += job.resourceAllocation[2].maxValue;

    });

    return retValue;
}
const mapStateToProps = (state) => ({
    params: getAllParams(state.jobs),
    enabled: state.jobs.filter(job => job.isSelected).length > 0
});

const mapDispatchToProps = (dipatch) => { }

export default connect(mapStateToProps, mapDispatchToProps)(ResourceAllocation);