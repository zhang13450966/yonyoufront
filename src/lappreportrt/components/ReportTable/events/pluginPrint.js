/*
 * @Author: xuyangt
 * @Descripttion: 
 * @Date: 2022-01-05 10:59:05
 * @LastEditTime: 2022-02-22 16:33:40
 */

import { ajax,Cipher,viewModel,toast,pageTo } from "nc-lightapp-front";
const opaqueDecrypt = Cipher.opaqueDecrypt;
const getGlobalStorage = viewModel.getGlobalStorage;
const getTokenUrl = '/nccloud/report/widget//anaprinttoken.do';
const printcurrUrl = '/nccloud/ufoe/datacenter/printcurr.do';
// const printViewUrl = '/nccloud/ufoe/datacenter/printpreview.do';
// const PrintAllRepDataUrl =  '/nccloud/ufoe/print/PrintAllRepData.do';// 打印套表
const SOCKET_URL = 'ws://127.0.0.1:9999/websocket';
const reportPrintAuthorityCheck = '/nccloud/report/widget/anaprintauthcheck.do';
//const SOCKET_URL = 'ws://10.11.115.110:9999/websocket';

// const qryPrintDataInfoAction = '/nccloud/report/print/qryPrintDataInfo.do'; // 套表打印从prev
 const PRINTPREVIEW = 'anaPreView';


const getReportPrintAuthorityCheck = ()=>{
    return new Promise(resolve=>{
        ajax({
            url:reportPrintAuthorityCheck,
            data:{},
            success:function(res){
                resolve(res);
            }
        })
    })
}

const getToken = (length)=>{
    return getReportPrintAuthorityCheck().then(()=>new Promise(resolve=>{
        ajax({
            url:getTokenUrl,
            data:{num:"0"},
            success:function(res){
                resolve(res);
            }
        })
    }));
}

const getPrintDataInfo = para=>{
    return new Promise(resolve=>{
        ajax({
            url:qryPrintDataInfoAction,
            data:para,
            success:function(res){
                resolve(res);
            }
        })
    })
}

export default async function pluginPrint(params) {
    const tokens =  await getToken();
    const nccloudsessionid = tokens.data;
    //这块需要找继梦问问怎么获取报表模型
    //const dataModel = this.afterChangeData.CellsModel;
   

    let printType = PRINTPREVIEW;
    let compalteAddress=printcurrUrl;
    //下面两部分自由报表能拿到？
    const userjson = [{
       printType, ...params
    }]
    let data = {
     userjson:userjson,
     nccloudsessionid,
     type: "11",
     sysType: "5",
     aeskey: opaqueDecrypt(getGlobalStorage('localStorage', "cowboy")),
     rockin: !!getGlobalStorage('localStorage', "rockin"),
     beginUrl: location.origin,
     compalteAddress,
     };
     let ws = new WebSocket(SOCKET_URL);
     ws.onopen = e => {
         console.log(e, 'onopen');
         ws.send(JSON.stringify(data))
     }
     ws.onmessage = e => {
         console.log(e.data, 'onmessage');
     }
     ws.onclose = e => {
         console.log(e, 'onclose');
     }
     ws.onerror = e=>{
        // pageTo.openTo(
        //     '/uap/printExeDown/ExeDownload/main/index.html?pk_message=dd',
        //     {}
        // );
        toast({ content: e.data, color: 'warning' });
        pageTo.openTo(
            '/uap/printExeDown/ExeDownload/main/index.html?pk_message=dd',
            {}
        );
     }
     
 };


