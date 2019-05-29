const FontConfigReducer = (state = {loaded: false}, action) => {
    switch(action.type) {
        case 'Font_Loaded': return {loaded: action.loaded};

        default: return state;
    }
}

export default FontConfigReducer;