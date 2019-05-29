import React from 'react';
const style = {
    width: '22px',
    height: '22px'
}
export const Icon = (props) => {
    const {width, height} = props;
    const filePath = `images/icons/${props.name}.png`
    return <img style={{width: width || '22px', height: height || '22px'}} src={filePath} alt={'I-'+props.name}></img>
}