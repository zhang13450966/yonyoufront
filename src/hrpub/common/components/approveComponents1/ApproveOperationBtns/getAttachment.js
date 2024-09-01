// import Ajax from "./../../api/ajax";
import { ajax } from 'nc-lightapp-front';

const queryAttachments =  "/nccloud/platform/attachment/query.do"

export default function (bilId){

    const params = {
        billId: bilId,
        fullPath: bilId
      };
    return  new Promise((resolve, reject)=>{

          ajax({
            url: queryAttachments,
            data: params,
            success: res => {
              let { success, data } = res;
              if (success) {
                    if(Object.prototype.toString.call(data) === "[object Array]"){
                    resolve(data)                        
                    }else{
                        resolve(res);
                    }
              }else{
                  console.warn('ajax请求错误');
                reject('ajax请求错误');
              }
            }
          });
    })
    
}

