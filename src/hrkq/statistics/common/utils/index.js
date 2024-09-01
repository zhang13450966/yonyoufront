import {formatDate, myBrowser} from 'src/hrpub/common/utils/utils.js';

/**
 * 获取试图窗口尺寸
 * rongqb 20190425
 */
function getClientSize() {
    let size = {};
    // 获取窗口宽度
    if (window.innerWidth) {
        size = {
            width: window.innerWidth,
            height: window.innerHeight
        };
    } else if ((document.body) && (document.body.clientWidth)) {
        size = {
            width: document.body.clientWidth,
            height: document.body.clientHeight
        };
    }

    if (document.documentElement
        && document.documentElement.clientWidth) {
        size = {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        };
    }
    return size;
}

/**
 * 获取当月第一天 00:00:00
 */
function getCurMonthStartTs() {
    let date = new Date();
    date.setDate(1);
    date.setHours(0);
    date.setSeconds(0);
    date.setMinutes(0);
    return date.getTime();
}

/**
 * 获取当月最后一天 23:59:59
 */
function getCurMonthEndTs() {
    let date = new Date();
    date.setMonth(date.getMonth() + 1);
    date.setDate(1);
    date.setHours(0);
    date.setSeconds(0);
    date.setMinutes(0);
    return date.getTime() - 1000;
}

/**
 * 获取当天 00:00:00
 */
function getCurDayStartTs() {
    let date = new Date();
    date.setHours(0);
    date.setSeconds(0);
    date.setMinutes(0);
    return date.getTime();
}

/**
 * 获取当天 23:59:59
 */
function getCurDayEndTs() {
    let date = new Date();
    date.setHours(23);
    date.setSeconds(59);
    date.setMinutes(59);
    return date.getTime();
}

/**
 * 获取开始日期和结束日期查询参数
 */
function getBEDateQueryCondition({
    beginValue = 0,
    endValue = 0,
    beginField = 'begintime',
    endField = 'endtime',
    querytype = 'tree',
    oprtype,
    logic = 'and'
} = {}) {
    beginValue = `${formatDate(beginValue, '-', 'YY-MM-DD')} 00:00:00`;
    endValue = `${formatDate(endValue, '-', 'YY-MM-DD')} 23:59:59`;

    let conditions = '';
    switch (oprtype) {
        case 'between':
            conditions = [{
                "field": beginField,
                "value": {
                    "firstvalue": `${beginValue}`,
                    "secondvalue": `${endValue}`
                },
                "oprtype": "between",
                "isIncludeSub": false,
                "refurl": "",
                "datatype": "33"
            }]
            break;
        // 专为请假、出差写的查询模板
        case 'billBetween':
            conditions = [
                {
                    "field": beginField,
                    "value": {
                        "firstvalue": `${beginValue}`,
                        "secondvalue": `${endValue}`
                    },
                    "oprtype": "between",
                    "display": `${beginValue}`,
                    "isIncludeSub": false,
                    "refurl": "",
                    "datatype": "34"
                },
                {
                    "field": endField,
                    "value": {
                        "firstvalue": `${beginValue}`,
                        "secondvalue": `${endValue}`
                    },
                    "oprtype": "between",
                    "display": `${endValue}`,
                    "isIncludeSub": false,
                    "refurl": "",
                    "datatype": "34"
                }
            ]
            break
        default:
            conditions = [
                {
                    "field": endField,
                    "value": {
                        "firstvalue": `${endValue}`,
                        "secondvalue": ""
                    },
                    "oprtype": "<=",
                    "display": `${endValue}`,
                    "isIncludeSub": false,
                    "refurl": "",
                    "datatype": "34"
                },
                {
                    "field": beginField,
                    "value": {
                        "firstvalue": `${beginValue}`,
                        "secondvalue": ""
                    },
                    "oprtype": ">=",
                    "display": `${beginValue}`,
                    "isIncludeSub": false,
                    "refurl": "",
                    "datatype": "34"
                }
            ]
    }

    return {
        querytype,
        querycondition: {
            logic,
            conditions
        }
    };
}

/**
 * 格式化 querycondition
 * @param {*} template
 */
function formatQueryCondition({ conditions } = {}, fields = {}) {
    let result = {};
    if (conditions &&
        conditions.length) {
        conditions.forEach(({
            display,
            field,
            oprtype,
            value,
            value: {
                firstvalue,
                secondvalue
            }
        }) => {
            if (/(date|time)$/i.test(field)) {
                firstvalue = new Date(firstvalue).getTime() || firstvalue;
                secondvalue = new Date(secondvalue).getTime() || secondvalue;
            }
            if (fields[field] &&
                Array.isArray(fields[field]) &&
                fields[field].length) {
                if (fields[field][1]) {
                    result[fields[field][1]] = secondvalue;
                }
                if (fields[field][0]) {
                    result[fields[field][0]] = firstvalue;
                }
                if (secondvalue === '' &&
                    firstvalue !== '') {
                    if (/^\>\=?$/.test(oprtype)) {
                        if (fields[field][0]) {
                            result[fields[field][0]] = firstvalue;
                        }
                    } else {
                        result[fields[field][1]] = firstvalue;
                    }
                }
            } else if (typeof fields[field] == 'string') {
                if (/name$/i.test(fields[field])) {
                    result[fields[field]] = display;
                } else {
                    result[fields[field]] = firstvalue;
                }
            } else {
                result[field] = firstvalue;
            }
        });
    }
    console.log('formatQueryCondition: ', conditions, 'result: ', result);
    return result;
}

/**
 * 格式化模版类型row attrcode
 */
function formatValueByRow(row, attrcode, lang = {}) {
    if (row) {
        switch (attrcode) {
            case 'begintime':
            case 'endtime':
                return formatDisplayDate(row, attrcode, lang);
            case 'tripbegintime':
            case 'tripendtime':
            case 'tripoffbegintime':
            case 'tripoffendtime':
                return (getValueByRow(row, attrcode) || '').slice(0, -3);
            case 'fill_date':
                return getValueByRow(row, attrcode).split(' ')[0];
            case 'otapplylength':
            case 'actuallen':
                return (getValueByRow(row, attrcode) || '') + `${lang['hrkq-0000064']}`;
            case 'isrevoked':
                return (getValueByRow(row, attrcode)) ? `${lang['hrkq-0000082']}` : `${lang['hrkq-0000083']}`;
            case 'tripday':
            case 'tripoffday':
                return (getValueByRow(row, attrcode) || '') + (getValueByRow(row, 'minunit', 'display') || '');
            case 'leaveday':
            case 'leaveoffday':
                return formatDisplayLength(row, attrcode);
            case 'applydate':
                    return (getValueByRow(row, attrcode) || '').slice(0, 10);


        }
    }
}

/**
 * 获取行指定attrcode value
 * @param {*} row
 * @param {*} attrcode
 * @param {*} key
 */
function getValueByRow(row, attrcode, key = 'value') {
    return row && (row[attrcode] && row[attrcode][key] || row.values && row.values[attrcode] && row.values[attrcode][key] || '');
}

/**
 * formatDisplayDate
 * @param {*} row
 * @param {*} attrcode
 */
function formatDisplayDate(row, attrcode, lang = {}) {
    // 是否是哺乳假
    let isBreastfeeding = !!getValueByRow(row, 'breastfeedingleaveway');
    let isHour = isBreastfeeding ? false : getValueByRow(row, 'minunit') === '1';
    let isHalfDate = isBreastfeeding ? false : !!(getValueByRow(row, 'start_day_type'));
    // 非小时假别 开始时间和结束时间的前端展示值 取showbegindate(前台申请开始时间) 和showenddate(前台申请结束时间) 这俩字段
    if (!isHour) attrcode = attrcode === 'begintime' ? 'showbegindate' : 'showenddate';
    let value = getValueByRow(row, attrcode) || '';

    if (value) {
        if (isHour) {
            return value.slice(0, -3);
        } else {
            if (isHalfDate) {
                return value.replace(/\s([\d\:]+)/, (a, b) => {
                    return attrcode === 'showbegindate' ? getValueByRow(row, 'start_day_type', 'display') : getValueByRow(row, 'end_day_type', 'display');
                })
            } else {
                return value.slice(0, -8);
            }
        }
    }
    return '';
}
/**
 * @desc: 格式化休假时长(哺乳假需特殊处理) 销假时长 出差时长
 * @param {type}
 * @return:
 */
function formatDisplayLength (row, attrcode) {
    // 是否是哺乳假
    let isBreastfeeding = !!getValueByRow(row, 'breastfeedingleaveway');
    let length = getValueByRow(row, attrcode) || '';
    if (isBreastfeeding) {
        return '每天' + parseInt(length) + '小时'
    }
    return length + (getValueByRow(row, 'minunit', 'display') || '');
}

/**
 * 格式化模版
 * @param {*} template
 */
function formatTemplate({ template, lang = {}, excludeKeys = ['trip_query', 'leave_query', 'overtime_query']} = {}) {
    for (let key in template) {
        if (!excludeKeys.includes(key) && template.hasOwnProperty(key)) {
            if (Array.isArray(template[key].items)) {
                template[key].items.forEach(item => {
                    switch (item.attrcode) {
                        case 'tripday':
                        case 'tripoffday':
                        case 'leaveday':
                        case 'leaveoffday':
                        case 'actuallen':
                        case 'otapplylength':
                            item.itemtype = 'input';
                        case 'begintime':
                        case 'endtime':
                        case 'tripbegintime':
                        case 'tripendtime':
                        case 'tripoffendtime':
                        case 'tripoffbegintime':
                        case 'isrevoked':
                            item.renderStatus = 'browse';
                            item.render = (text, row, index) => {
                                return (
                                    <span style={{ textAlign: 'right' }}>
                                        {formatValueByRow(row, item.attrcode, lang)}
                                    </span>
                                );
                            };
                            break;
                        case 'pk_psndoc':
                            item.fixed = 'left';
                            break;
                    }
                });
            }
        }
    }
    return template;
}

/**
 * @desc: 开始、结束时间 格式化时间戳 补全小时 分 秒  00:00:00 或 23:59:59
 * @param {string} date
 * @param {string} padType '0' 补全开始   '1' 补全结束
 * @return:
 */
function padDateTime (date, padType = '0', separator = ' ') {
    const padStr = padType === '0' ? '00:00:00' : '23:59:59';
    let result = date + separator + padStr
    if(myBrowser()==='IE'){
        result = result.replace(new RegExp(/-/g), "/");
    }
    return result
}

export {
    formatValueByRow,
    formatTemplate,
    getClientSize,
    getCurMonthStartTs,
    getCurMonthEndTs,
    getCurDayStartTs,
    getCurDayEndTs,
    formatQueryCondition,
    getBEDateQueryCondition,
    padDateTime
}
