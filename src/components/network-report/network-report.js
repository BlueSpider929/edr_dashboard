import React from 'react';
import { connect } from 'react-redux';
import {Icon} from '../icon';
import NumberCounter from '../number-counter/number-counter';
import { Card } from '../card/card';
import {CardHeader} from '../card-header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const statusIconStyle = {
    main: {
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1rem'
    },
    valueIcon: {
        borderRadius: '50%',
        minWidth: '19px',
        minHeight: '19px',
        fontSize: '14px',
        border: '1px solid'
    },
    maxValue: {
        fontSize: '8px'
    }

}

const StatusIcon = ({ value, max }) => {
    const color = value / max > 0.5 ? 'green' : 'red';
    const isOk = value / max > 0.5;
    return (
        <div className="d-flex flex-row">
            <div className="d-flex flex-col" style={{ color: color, ...(statusIconStyle.main) }}>
                <span style={statusIconStyle.valueIcon}>
                    <NumberCounter speed={1000} to={value}></NumberCounter>
                </span>
                <span style={statusIconStyle.maxValue}>
                    OUT OF {max}
                </span>
            </div>
            <FontAwesomeIcon icon={isOk ? 'check' : 'times'} style={{ margin: '4px', fontSize:'1rem',  color: isOk ? 'green' : 'red' }}></FontAwesomeIcon>

        </div>
    );
};

class NetworkReport extends React.Component {
    render() {
        const {params, enabled} = this.props;
        
        return (
            <div className={enabled?'':'disabled_tile'} style={{height: '100%'}}>
            <Card>
                {{
                     className: 'card-hover',
                     header: <CardHeader >
                     {{
                       title: 'Network Tests',
                       icon: <Icon width="27px" height="27px" name="internet"></Icon>
                     }}
                   </CardHeader>,
                   content:   <div style={{height:'100%'}}>
                   <table className='network_table' style={{height:'100%'}}>
                       <tbody>
                           <tr>
                               <td><Icon width='34px' height='28px' name="network_lan"></Icon></td>
                               <td>Local Network</td>
                               <td><StatusIcon value={params.localNetwork.value} max={params.localNetwork.maxValue}></StatusIcon></td>
                           </tr>
                           <tr>
                               <td><Icon width='32px' height='29px' name="firewall"></Icon></td>
                               <td>FireWall</td>
                               <td><StatusIcon value={params.fireWall.value} max={params.fireWall.maxValue}></StatusIcon></td>
                           </tr>
                           <tr>
                               <td><Icon  width='32px' height='27px' name="branch_office_network"></Icon></td>
                               <td>Branch Offices</td>
                               <td><StatusIcon value={params.branchOffice.value} max={params.branchOffice.maxValue}></StatusIcon></td>
                           </tr>
                           <tr>
                               <td><Icon width='38px' height='30px' name="wifi"></Icon></td>
                               <td>Internet Connection</td>
                               <td><StatusIcon value={params.internet.value} max={params.internet.maxValue}></StatusIcon></td>
                            </tr>
                       </tbody>
                   </table>
               </div>
   
                }}
            </Card>
            </div>
                  );
    }
}


// jobs contains resource info in array [localNetwork, FireWall, branch office, internet]
// this function will calculate sum of IOPS, CPU, RAM for each job
// returns { localNetwork: {value, maxValue}, FireWall: {value, maxValue}, branchOffice: {value, maxValue}}
const getAllParams = (jobs) => {
    const retValue = {
        localNetwork: {
            value: 0,
            maxValue: 0
        },
        fireWall: {
            value: 0,
            maxValue: 0
        },
        branchOffice: {
            value: 0,
            maxValue: 0
        },
        internet: {
            value: 0,
            maxValue: 0
        }
    };

    jobs.filter(job => job.isSelected).forEach(job => {
        retValue.localNetwork.value += job.networkTest[0].value;
        retValue.localNetwork.maxValue += job.networkTest[0].maxValue;

        retValue.fireWall.value += job.networkTest[1].value;
        retValue.fireWall.maxValue += job.networkTest[1].maxValue;

        retValue.branchOffice.value += job.networkTest[2].value;
        retValue.branchOffice.maxValue += job.networkTest[2].maxValue;

        retValue.internet.value += job.networkTest[3].value;
        retValue.internet.maxValue += job.networkTest[3].maxValue;
    });

    return retValue;
}
const mapStateToProps = (state) => ({
    params: getAllParams(state.jobs),
    enabled: state.jobs.filter(job => job.isSelected).length > 0
});

const mapDispatchToProps = (dipatch) => { }

export default connect(mapStateToProps, mapDispatchToProps)(NetworkReport);