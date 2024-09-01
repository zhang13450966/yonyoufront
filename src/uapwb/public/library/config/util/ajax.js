import {toast, ajax} from 'nc-lightapp-front';
/**
 * @method 异步方式调用ajax
 * @param {string} url
 * @param {object} [data] 请求参数
 * @param {object} [additions] 额外ajax配置, 可以覆盖大部分配置
 */
export function promiseAjax(url, data = {}, additions = {}) {
    ajax({
        loading: true, url, data, ...additions,
        success: (res) => {
            console.trace(`%c promiseAjax::(${url})-->`, 'color: white;background: green;', {data, res});
            _executor.resolve(res); //不控制逻辑 转发结果
        },
        error(res) {
            console.log('%c promiseAjax接口报错-->', 'color: white;background: red;', {url, data, res});
            toast({ color: 'danger', content: res.message });
            _executor.reject(res);
        }
    });

    let _executor = {};
    return new Promise((resolve, reject) => _executor = {resolve, reject});
}