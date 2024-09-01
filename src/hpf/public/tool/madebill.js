import { ajax, cacheTools } from 'nc-lightapp-front';

/**
 * 制单   
 * @author xiejhk
 * @param {*} madeData 制单条件 
 * @param {*} pk_bill  主键编码   
 * @param {*} appcode 小应用编码
 * @param {*} list 是否列表  批量
 */
export function madeBill(props, madeData, pk_bill, appcode, list, url) {
  let madeDatas = [];
  if (list) {
    madeData.forEach((madeBillData) => {
      madeDatas.push({
        pk_bill: madeBillData.data.values[pk_bill].value,
      });
    });
  } else {
    madeDatas = madeData;
  }
  ajax({
    url: url,
    data: madeDatas,
    success: (res) => {
      if (res.success) {
        //打开结算制单节点
        cacheTools.set(appcode + res.data.cachekey, res.data.pklist);
        props.openTo(res.data.url,
          {
            status: 'edit',
            n: '凭证生成',
            appcode: res.data.appcode,
            pagecode: res.data.pagecode,
            scene: appcode + res.data.cachekey
          });
      }
    }
  });
}
