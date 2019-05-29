
const numberValueParser = (val) => {
    return parseInt(val);
}
const floatValueParser = (val) => {
    return parseFloat(val);
}
const stringValueParser = (val) => {
    return val;
}

const maxCurrentValueParser = (val) => {
    if(!val) 
    return val;
    const values = val.split(';');
    let value = numberValueParser(values[0]);
    let maxValue = numberValueParser(values[1]);
    return {value, maxValue};
}

const ColumnConfig = [
    {
        index: '0',
        name: 'jobName',
        parser: stringValueParser
    },
    {
        index: '1',
        name: 'applicationStatus',
        parser: maxCurrentValueParser
    },
    {
        index: '2',
        name: 'databaseStatus',
        parser: maxCurrentValueParser
    },
    {
        index: '3',
        name: 'advancedTestStatus',
        parser: maxCurrentValueParser
    },
    {
        index: '4',
        name: 'serverStatus',
        parser: maxCurrentValueParser
    },

    {
        index: '5',
        name: 'recoveryReadiness',
        parser: numberValueParser
    },
    {
        index: '6',
        name: 'ttl',
        parser: (val) => {
            // format value: maxValue: date

            const values = val.split(';');
            let value = floatValueParser(values[0]);
            let maxValue = floatValueParser(values[1]);
            let date = new Date();
            const reg = new RegExp('[0-9][0-9][0-9][0-9]:[0-9][0-9]:[0-9][0-9]');

            return {
                value, maxValue
            }
            // TODO implement date parser
            // reg.exec().forEach(match => {
            //     date = new Date
            // })
        }
    },
    {
        index: '7',
        name: 'monthlyReadiness',
        parser: (value) => {
            let values = [];
            if (!value)
                return values;
            value.split('|').filter(v => v).forEach(v => {
                const splitValues = v.split(';');
                values.push({
                    value: parseInt(splitValues[0]),
                    maxValue: splitValues[1]
                })
            });
            return values;
        }
    },
    {
        index: '8',
        name: 'networkTest',
        parser: (val) => {
            let values = [];
            if (!val)
                return val;
            val.split('|').forEach(v => {
                const splitValues = v.split(';');
                values.push({
                    value: parseInt(splitValues[0]),
                    maxValue: parseInt(splitValues[1])
                })
            });
              return values;
        }
    },
    {
        index: '9',
        name: 'resourceAllocation',
        parser: (val) => {
            let values = [];
            if (!val)
                return val;
            val.split('|').forEach(v => {
                const splitValues = v.split(';');
                values.push({
                    value: parseInt(splitValues[1]),
                    maxValue: parseInt(splitValues[0])
                })
            });
              return values;
        }
    },

]


export const  EdrCSVParser =  (data) => {
    const parsedValues = [];
    data.split('\n').filter((val, index) => {
        return val && val.length > 0 && index > 0

    }).forEach(row => {
        let obj = {};
        const values= row.split(',')
        ColumnConfig.forEach((col) => {
            obj[col.name] = col.parser(values[col.index]);
        })
        obj.isSelected = false;
        parsedValues.push(obj);

    });
    return parsedValues;
}



// for testing 
//const data = require('../../public/data.csv');


// const fs = require('fs');
// const path = require('path');
// const filePath = path.join(__dirname, 'data.csv');
// const stat = fs.statSync(filePath);
// const fd = fs.openSync(filePath, 'r');
// const buffer = new Buffer(stat.size);
// const data = fs.readSync(fd, buffer, 0, buffer.length);
// const d =JSON.stringify(parseData(buffer.toString()), null, '  ');
// console.log(d);