export function average(values=[]) {
    if(values.length === 0) 
    { return 0;}

    return values.reduce((sum,value) => sum+value)/values.length;
}

export function sum(values=[]) {
    if(values.length === 0) 
    { return 0;}

    return values.reduce((sum,value) => sum+value);
}