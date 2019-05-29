import {COLORS} from '../../constants/style'
export const GAUGE_CONFIG = 
    {
        angle: 0, // The span of the gauge arc
        lineWidth: 0.2, // The line thickness
        radiusScale: 1, // Relative radius,
        animationSpeed: 1,
        pointer: {
            length: 0.36, // // Relative to gauge radius
            strokeWidth: 0.036, // The thickness
            color: '#a9a9a9' ,// Fill color
            shadowOffset: 0,
            shadowColor: '#ffffff',
            animationSpeed: 1,
        },
        limitMax: false,     // If false, max value increases automatically if value > maxValue
        limitMin: false,     // If true, the min value of the gauge will be fixed
        strokeColor: '#E0E0E0',  // to see which ones work best for you
        
        containerStrokeColor: '#e0e0e0',
        containerRadius: 8,
        containerWidth: 2,
        
        generateGradient: true,
        highDpiSupport: true,     // High resolution support
        staticZones: [
            {strokeStyle: COLORS.red, min: 99, max: 100}, // Red from 100 to 130
            {strokeStyle: COLORS.yellow, min: 90, max: 99}, // Yellow
            {strokeStyle: COLORS.green, min: 0, max: 90}, // Green
           
         ],
         renderTicks: {
            divisions: 12,
            divWidth: 3,
            asDots: true,
            divLength: 0.09,
            divColor: '#333333',
          },
        valueFontFamily: 'Poppins',
        valueFontSize: '24',
        valueFontWeight: 'bolder',
        valueColor: COLORS.blue,
        
        unitFontFamily: 'Poppins',
        unitFontSize: '24',
        unitFontWeight: 'normal',
        unitColor: COLORS.lightGray,
        showValueContainer: false

    };