function deepClone(data){
    let string = JSON.stringify(data);
    return JSON.parse(string);
}

function filterDelRows(rows){
    let length = rows.length-1;
    for(;length>=0;length--){
        if(rows[length].status === '3'){
            rows.splice(length,1);
        }
    }
}

const Utils = {
    clone: deepClone,
    filterDelRows: filterDelRows
};
export default Utils;