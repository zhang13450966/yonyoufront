/**
 *
 * Created by shenzaifang on 2019-05-20
 */
import {toast} from 'nc-lightapp-front';
import Ajax from "./ajax";

export function snRequestMeta (reqData, callback) {
    Ajax({
        url: '/nccloud/platform/pub/mergerequest.do',
        data: reqData,
        success: function (res) {
            let meta = res.data;
            if (callback && typeof callback == 'function') {
                callback(meta);
            }
        },
        error: function (res) {
            console.error(res)
        }
    });
}

export function hrAjax (data) {
    return new Promise((resolve, reject) => {
        Ajax({
            url: data.url,
            method: 'post',
            data: data.body,
            success: (res) => {
                resolve(res);
            },
            error: (err) => {
                toast({
                    color: 'danger',
                    content: `<div style='max-width:430px;word-break: break-word;white-space: normal;'>${err.message}</div>`
                });
                reject(err);
            }
        });

    });
}