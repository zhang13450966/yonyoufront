/* 获取参数 */
export function getParamByLocation(queryString, pop) {
    let result = '';
    queryString = queryString.substring(1);
    if (queryString) {
        let paramsArr = queryString.split('&');
        if (paramsArr && paramsArr instanceof Array) {
            paramsArr.forEach((item) => {
                if (item.indexOf('=') != -1 && item.split('=') && item.split('=') instanceof Array) {
                    if (item.split('=')[0] === pop) {
                        if (item.split('=')[1]) {
                            result = decodeURIComponent(item.split('=')[1]);
                        }
                    }
                }
            });
        }
    }
    return result;
}