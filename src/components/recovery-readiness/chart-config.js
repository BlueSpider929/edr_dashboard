
const GAUGE_CONFIG =
{
    angle: 0.49, // The span of the gauge arc
    lineWidth: 0.08, // The line thickness
    radiusScale: 2, // Relative radius,
    animationSpeed: 50,
 
    limitMax: false,     // If false, max value increases automatically if value > maxValue
    limitMin: false,
    colorStart: '#263774',
    colorStop: '#dee6ee',     // If true, the min value of the gauge will be fixed
    strokeColor: '#E0E0E0',  // to see which ones work best for you
    generateGradient: true,
    highDpiSupport: true,     // High resolution support
    title: '',
    valueFontFamily: 'Poppins',
    valueFontSize: '70',
    background: '#ff0000',
    colorScale: '#dee6ee',
    colorMiddle: "#263774",
    colorStart: "#2862a2",
    colorStop: "#263774",
    showBall: false,
    showTitle: false,
    unitFontSize: '30'


};

export const getGaugeConfig = () => {
    return { ...GAUGE_CONFIG };
}