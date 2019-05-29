import React from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js'
import { connect } from 'react-redux';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../../constants/style';
import { Card } from '../card/card';
import { CardHeader } from '../card-header';
import { Icon } from '../icon';

const canvas_width = 220;
const canvas_height = 175;
const data = {
    labels: getLastNMonths(3),
    datasets: [
        {
            lineTension: 0.1,
            fillColor: SECONDARY_COLOR,
            strokeColor: PRIMARY_COLOR,
            pointColor: "transparent",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [0, 0, 0]
        },
    ]
};
const chart_options = {
    responsive: true,
    tooltips: {
        mode: 'index'
    },
};

function getLastNMonths(n) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const months = []
    const today = new Date();
    for (var i = n - 1; i >= 0; i -= 1) {
        var d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        var month = monthNames[d.getMonth()];
        months.push(month);
    }
    return months;
}
class MonthlyReadiness extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: this.getChartConfig([]),
            canvas: null,
            lineChart: null,
            lineTension: 0,
        };
        this.onCanvasCreated = this.onCanvasCreated.bind(this);
    }

    getChartConfig(values) {
        var grd = document.createElement('canvas').getContext('2d').createLinearGradient(0, 0, 0, canvas_height);
        grd.addColorStop(0.2, 'rgba(20, 89, 171, 0.3)');
        grd.addColorStop(0.9, 'rgba(20, 89, 171, 0)');
        return {
            labels: getLastNMonths(3),
            datasets: [
                {
                    borderColor: '#2d4498',
                    borderWidth: 2,
                    backgroundColor: grd,
                    data: [],
                },
            ]
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            chartData: this.getChartConfig(nextProps.value || [])
        });

        if (this.state.lineChart) {
            var chart = this.state.lineChart;
            chart.data.datasets.forEach((dataset) => {
                dataset.data = nextProps.value;
            });
            chart.update();
        }
    }
    render() {
        const {enabled} = this.props;
        return (
            <div style={{ height: '100%' }} className={enabled ? '' : 'disabled_tile'}>
             <Card>
                {{
                    className: 'card-hover',
                     header: <CardHeader>
                     {{
                       title: 'Monthly Readiness',
                       icon: <Icon width="25px" height="25px"  name="calendar"></Icon>
                     }}
                   </CardHeader>,
                     content:
                     
                          //<Line data={this.state.chartData} options={chart_options}></Line>
                          <canvas ref={this.onCanvasCreated}></canvas>
                  
                    }}
                    </Card>
            </div>            
           
        )
    }

    onCanvasCreated(canvas) {
        this.setUpChart(canvas);
    }

    setUpChart(canvas) {
        //console.log(Chart);
        const chart = new Chart(canvas, {type:'line', data: this.state.chartData, option: chart_options});
        this.setState({
            lineChart: chart
        })
    }
}



const getReadinessValue = (jobs) => {
    let values = [0, 0, 0];
    jobs.map(job => job.monthlyReadiness.map(val => val.value)).forEach(readinessValues => {

        values.forEach((val, index) => {
            values[index] += readinessValues[index] || 0;
        })
    });

    return values.map(val => val / jobs.length);

}


const mapStateToProps = (state, props) => (
    {
        value: getReadinessValue(state.jobs.filter(job => job.isSelected)),
        enabled: state.jobs.filter(job => job.isSelected).length > 0
    }
);

const mapDispatchToProps = (dispatch, ownProps) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(MonthlyReadiness);
