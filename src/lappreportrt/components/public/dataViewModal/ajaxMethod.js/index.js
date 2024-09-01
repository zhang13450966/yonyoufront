
import { ajax } from "nc-lightapp-front";


/**
 * 加载是否显示数据视图菜单的相关信息
 */
export function fetchDisplayDataViewInfo(data) {

  return new Promise((resolve, reject) => {
    ajax({
      url: "/nccloud/report/widget/formschemecheck.do",
      data,
      success: (res) => {
        if (!res.data) return resolve({});
        let ret = JSON.parse(res.data);
        resolve(ret);
      }
    });
  });
}

/**
    加载treeData
    formsmartmodelload.do
 */

export function loadDataViewFirstNode({ pk_def, isRunState, reportPk, exAreaPK }) {

  return new Promise((resolve, reject) => {
    ajax({
      url: "/nccloud/report/widget/formsmartmodelload.do",
      data: {
        pk_def,
        isRunState,
        reportPk,
        exAreaPK
      },
      success: (res) => {
        if (!res.data) return resolve([]);
        let ret = JSON.parse(res.data);
        resolve(ret);
      }
    });
  });
}
/**
    懒加载
    loadsmartmodelsub.do
 */
export function loadSmartModelSubData(record) {
  return new Promise((resolve) => {
    const { isprovider, pk_def, code, metalink, providerParent = false, isRunState, reportPk, exAreaPK } = record;
    ajax({
      url: "/nccloud/report/widget/formsmartmodelloadsub.do",
      data: {
        provider: isprovider,
        pk_def,
        parentId: code,
        endMetaGuid: metalink && metalink.endMetaGuid,
        providerParent,
        isRunState,
        reportPk,
        exAreaPK
      },
      success: (res) => {
        if (!res.data) return resolve([]);
        let ret = JSON.parse(res.data);
        ret.forEach(item => item.rootParentName = record.rootParentName || record.defname);
        resolve(ret);
      }
    });
  });
}

// 保存操作，设置默认，重命名，删除操作都将在该接口处理

export function operateDataView(params) {
  return new Promise((resolve) => {
    const { saved_data } = params;
    ajax({
      url: "/nccloud/report/widget/formschemesave.do",
      data: {
        ...params,
        ...saved_data,
      },
      success: (res) => {
        if (res.success && !res.data) {
          return resolve('success')
        }
        if (!res.data) return resolve([]);
        let ret = JSON.parse(res.data);
        resolve(ret);
      }
    });
  });
}

 // 请求所有数据视图数据


export function fetchAllDataView(params) {
  return new Promise((resolve) => {
    const { appcode, pk_report } = params;
    ajax({
      url: "/nccloud/report/widget/formschemeload.do",
      data: {
        appcode,
        pk_report,
      },
      success: (res) => {
        if (!res.data) return resolve([]);
        let ret = JSON.parse(res.data);
        resolve(ret);
      }
    });
  });
}