import React,{Component} from 'react';

import {PRIMARY_COLOR} from '../constants/style'

const STYLES = {
    icon : {
        position: 'absolute',
        left: '-2px',
    },

    header: {
        color: PRIMARY_COLOR,
        textAlign: 'center',
        position: 'relative'
    }
}

export class CardHeader extends Component {

    render(){
        const {icon, title} = this.props.children;

        return (
            <div style={STYLES.header}>
                <span style={STYLES.icon}>
                    {icon}
                </span>
                {title}
            </div>
        );
    }
}