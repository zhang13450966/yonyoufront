/**
 *
 * Created by shenzaifang on 2020-08-06
 */
import downLoad from 'src/hrpub/common/utils/download/download';
import { toast } from 'nc-lightapp-front';

export default function formDownLoad ({url, body, onResult, onError, method = 'post', enctype} = {}) {
    downLoad({
        url, body, onResult: (res) => {
            let textContent = res.textContent&&JSON.parse(res.textContent)
            // form下载，如果成功什么都不返回，失败则返回
            if(textContent&&textContent.message){
                toast({
                    color: "danger",
                    content: textContent.message
                })
            }
        }, onError: (err) => {
            let msg = JSON.stringify(err);
            if(err.code === 18 && err.name === 'SecurityError'){
                msg = '数据量过大，请减少查询范围再尝试导出！';
            }
            toast({
                color: "danger",
                content: msg
            })
        }, method: 'get', enctype: 1
    })
}

/**
 * 浏览器里取参数
 * @param url
 * @returns {Object}
 */
export function getUrlParam(url) {
    let urlArr = url.split('?');
    if (urlArr.length < 2) {
        return null;
    }
    let tempArr = urlArr[1].split('&');
    let param = {}
    for (let i = 0; i < tempArr.length; i++) {
        let item = tempArr[i].split('=');
        if(item.length>1){
            param[item[0]] = item[1]
        }
    }
    return param;
}