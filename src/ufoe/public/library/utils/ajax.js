import {toast, ajax} from 'nc-lightapp-front';
/**
 * @method 异步方式调用ajax
 * @param {string} url
 * @param {object} [data] 请求参数
 * @param {object} [additions] 额外ajax配置, 可以覆盖大部分配置
 */
export function _promiseAjax(url, data = {}, additions = {}) {
    let start = Date.now();
    ajax({
        loading: true, url, data, ...additions,
        success: (response) => {
            console.log(
                `😊%c promiseAjax%c ${url}`,
                'color: white;background: green;', 'color: white;background: rebeccapurple;',
                {data, response, url, timing: Date.now() - start});

            _executor.resolve(response); //不控制逻辑 转发结果
        },
        error(response) {
            console.log(
                `😱%c promiseAjax%c ${url}`,
                'color: white;background: red;', 'color: white;background: rebeccapurple;',
                {data, response, url, timing: Date.now() - start});

            toast({ color: 'danger', content: response.message });
            _executor.reject(response);
        }
    });

    let _executor = {};
    return new Promise((resolve, reject) => _executor = {resolve, reject});
}