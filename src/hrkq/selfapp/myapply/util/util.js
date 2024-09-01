import { formatDate } from 'src/hrpub/common/utils/utils.js'
/**
 * 获取当月第一天 00:00:00
 */
function getCurMonthStart() {
    let date = new Date();
    date.setDate(1);
    date.setHours(0);
    date.setSeconds(0);
    date.setMinutes(0);
    return formatDate(date);
}
/**
 * 获取当月最后一天 23:59:59
 */
function getCurMonthEnd() {
    let date = new Date();
    date.setMonth(date.getMonth() + 1);
    date.setDate(1);
    date.setHours(0);
    date.setSeconds(0);
    date.setMinutes(0);
    return formatDate(date.getTime() - 1000);
}
export {
    getCurMonthEnd,
    getCurMonthStart
}