// 转档的一二三步骤验证操作

import {hrAjax as proFetch} from 'src/hrpub/common/utils/utils';
import {toast} from 'nc-lightapp-front';
var bUseHttps = false;
var _wps = {}

const wpsQueryFile = () => {
    return proFetch({
        url: '/nccloud/hrhi/rptfef/ReportKey.do',
        body: {}
    });

}
const getParam = (postData) => {
    return proFetch({
        url: '/nccloud/hr/login/InternalAction.do',
        body: postData
    })
}
/**
 * 此方法是根据wps_sdk.js做的调用方法封装
 * 可参照此定义
 * @param {*} funcs     这是在WPS加载项内部定义的方法，采用JSON格式（先方法名，再参数）
 */

function _WpsInvoke(funcs, front, jsPluginsXml,isSilent) {
    var info = {};
    info.funcs = funcs;
     // 判断当前环境是http还是https
    //  bUseHttps = 'https:' == document.location.protocol ? true: false;
    var func = bUseHttps ? WpsInvoke.InvokeAsHttps : WpsInvoke.InvokeAsHttp
    func(WpsInvoke.ClientType.wps, // 组件类型
        "WpsOAAssist", // 插件名，与wps客户端加载的加载的插件名对应
        "dispatcher", // 插件方法入口，与wps客户端加载的加载的插件代码对应，详细见插件代码
        info, // 传递给插件的数据
        function (result) { // 调用回调，status为0为成功，其他是错误
            if (result.status) {
                if (bUseHttps && result.status == 100) {
                    WpsInvoke.AuthHttpesCert('请在稍后打开的网页中，点击"高级" => "继续前往"，完成授权。')
                    return;
                }
                toast({
                    color: 'info',
                    content: result.message
                })
                // alert(result.message)

            } else {
                console.log(result.response)
                // showresult(result.response)
            }
        },front,
        jsPluginsXml,
        isSilent)
}
// WpsInvoke.RegWebNotify(WpsInvoke.ClientType.wps, "WpsOAAssist", function (messageText) {
//     var span = window.parent.document.getElementById("webnotifyspan")
//     span.innerHTML = messageText
// })
function openRevision(allData) {
    // var filePath = "C:\\Users\\Administrator\\Desktop\\wps备份\\样章.docx"
    // http://preview/nccloud/hrhi/rptfef/ReportDownload.do
    // var filePath = "http://preview/nccloud/hrhi/rptfef/ReportDownload.do"
    var uploadPath = "D://test/"
    var jsPluginsXml = location.origin + '/nccloud/resources/hrhi/public/wpsconfig/jsplugins.xml'
    _WpsInvoke([{
        "OpenDoc": {
            "uploadPath": uploadPath, // 保存文档上传路径
            "fileName": 'fromNetWork',
            "RptName":allData.RptName,
            "appcode":allData.appcode,
            "key":allData.key,
            "pk_rpt_def":allData.pk_rpt_def,
            "pk_psndoc":allData.pk_psndoc,
            "pk_psnjob":allData.pk_psnjob,
            "pk_conmodel": allData.pk_conmodel,
            "pk_psndoc_sub": allData.pk_psndoc_sub,
            "pk_agreement": allData.pk_agreement,
            "pk_org": allData.pk_org,
            // "userName": allData.UserName, //用户名
            "revisionCtrl": {
                "bOpenRevision": false,
                "bShowRevision": false
            },
            "internalDataFactory": "nccloud.web.hrhi.rptdef.factory.RtfDownloadFactory"
        }
    }

], true, jsPluginsXml)
}

_wps['openRevision'] = {
    action: openRevision,
}
export {
    openRevision,
    wpsQueryFile,
    getParam
}