
/**
 * 
 * 对象的深拷贝函数
 * 
 */

 import React from 'react';

 export default function deepCopy(originData) {
    let result = null;

    let dataType = getType(originData);

    if(
        dataType === 'String' || 
        dataType === 'Number' || 
        dataType === 'Boolean' ||
        dataType === 'Null' ||
        dataType === 'Undefined' ||
        dataType === 'Function' ||
        dataType === 'ReactElement'
    ) { 
        result = originData
    }
    else if(dataType === 'Object') {
        result = {};
        Object.keys(originData).forEach((key) => {
            result[key] = deepCopy(originData[key]);
        });
    }
    else if(dataType === 'Array') {
        result = originData.map((item) => {
            return deepCopy(item);
        });
    }

    return result;
 }

 function getType(data) {

    if(React.isValidElement(data)) {
        return 'ReactElement';
    }
    let dataType = Object.prototype.toString.call(data);

    dataType = dataType.substring(8, dataType.length - 1);

    return dataType;
 }

