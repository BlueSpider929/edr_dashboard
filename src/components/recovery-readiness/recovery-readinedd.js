import React from 'react';

import { Doughnut } from '../gauge/gauge-extends'
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { average } from '../../services/helpers'
import NumberCounter from '../number-counter/number-counter';
import { Card } from '../card/card';
import { CardHeader } from '../card-header';
import { Icon } from '../icon';
import { getGaugeConfig } from './chart-config';


const data = [{
    value: 0,
    color: "#13487e",

},
{
    value: 0,
    color: "#e9f4fb",
}]

const chart_text = {
    position: 'absolute',
    left: '0px',
    right: '0px',
    fontSize: '4rem'
}

class RecoveryReadiness extends React.Component {

    constructor(props) {
        super(props);
        const { max, value } = this.props;

        this.state = {
            gauge: null,
            canvas: null
        };
        this.setCanvas = this.setCanvas.bind(this);

    }


    componentWillReceiveProps(nextProps) {
        const { value, fontLoaded } = nextProps;
        if (!this.state.gauge)
            return;
        if (this.props.value !== value) {
            this.state.gauge.set(value); // updating value
        }

    }


    // callback when we get reference of canvas
    setCanvas = (canvas) => {
        this.setState({ canvas });
        this.setUpChart(canvas);
    }


    getGaugeConfig() {
        const options = getGaugeConfig();
        options.title = '';
        return options;
    }

    // set up chart
    setUpChart(canvas) {
        var opts = this.getGaugeConfig();
        var gauge = new Doughnut(canvas).setOptions(opts);
        gauge.maxValue = 100;
        gauge.setMinValue(0);
        gauge.set(0);
        this.setState({ gauge });
    }
    render() {

        const { enabled, fontLoaded } = this.props;
        return (
            <div style={{ height: '100%' }} className={enabled ? '' : 'disabled_tile'}>
                <Card>
                    {{
                        className: 'card-hover',
                        header: <CardHeader>
                            {{
                                title: 'Recovery Readiness',
                                icon: <Icon width="25px" height="25px" name="refresh"></Icon>
                            }}
                        </CardHeader>,
                        content: <div style={{ position: 'relative' }}>
                            {fontLoaded ? <canvas ref={this.setCanvas} width="200" height="200" style={{ width: '200px', height: '200px' }}></canvas> : ''}
                        </div>,
                        footer: 'Fri Aug 1'
                    }}
                </Card>
            </div>

        )
    }
}

const getAverageValue = (jobs) => {
    let selectedJobs = jobs.filter(job => job.isSelected);
    return average(selectedJobs.map(job => job.recoveryReadiness));
}
const mapStateToProps = (state) => (
    {
        value: getAverageValue(state.jobs),
        enabled: state.jobs.filter(job => job.isSelected).length > 0,
        fontLoaded: state.fontConfig.loaded
    }
);



export default connect(mapStateToProps, null)(RecoveryReadiness);


