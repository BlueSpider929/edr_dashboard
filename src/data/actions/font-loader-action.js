
var WebFont = require('webfontloader');


const FontLoaded = (loaded) => {
    return {
        type:'Font_Loaded',
        loaded
    }
}
export const loadFonts = () => {
    return function (dispatch) {
        WebFont.load({
            custom: {
                families: ['Poppins', 'Poppins Semi Bold', 'Poppins Extra Bold'],
                urls: ['assets/fonts/fonts.css']
            },
            active: () => {
                console.log('font Loaded');
                dispatch(FontLoaded(true));
            },
            inactive: () => {
                dispatch(FontLoaded(false))
            }
        }
        );
    }
}