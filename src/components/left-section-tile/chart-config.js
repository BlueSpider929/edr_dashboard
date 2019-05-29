
const GAUGE_CONFIG =
{
    angle: 0.49, // The span of the gauge arc
    lineWidth: 0.06, // The line thickness
    radiusScale: 2, // Relative radius,
    animationSpeed: 50,
    pointer: {
        length: 0.36, // // Relative to gauge radius
        strokeWidth: 0.096, // The thickness
        color: '#a9a9a9',// Fill color
        animationSpeed: 1,
    },
    ballRadius: '6',
    limitMax: false,     // If false, max value increases automatically if value > maxValue
    limitMin: false,
    colorStart: '#263774',
    colorStop: '#dee6ee',     // If true, the min value of the gauge will be fixed
    strokeColor: '#E0E0E0',  // to see which ones work best for you
    generateGradient: true,
    highDpiSupport: true,     // High resolution support
    title: 'Left Section',
    titleFontFamily: 'Poppins',
    valueFontFamily: 'Poppins',
    titleFontSize: '8',
    valueFontSize: '18',
    ballBorderScale: '0.2',
    background: '#ff0000',
    colorScale: '#dee6ee',
    ballStartColor: '#151A5A',
    ballStopColor: '#236774',
    ballImage: '',
    colorMiddle: "#2765A6",
    colorStart: "#1F4181",
    colorStop: "#151858",
    showBall: true,
    showTitle: true,
    unitFontSize: '18'
};

export const getGaugeConfig = () => {
    return { ...GAUGE_CONFIG };
}