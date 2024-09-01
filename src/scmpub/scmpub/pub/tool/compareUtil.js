/*
 * @Author: liulux
 * @PageInfo: 卡片整单关闭按钮  
 * @Date: 2021-9-04 23:23:17 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-06 10:42:27
 */

/**
  * 列表单行操作差异容错
  * @param {*} newData 差异返回的新数据
  * @param {*} oldValues 操作前的行数据
  * @param {*} config 差异操作参数
  */

function listSingleTolerateForCompare(newData, oldValues, config) {
	let { headAreaId } = config;
	let newValues = newData.head[headAreaId].rows[0].values;
	newData.head[headAreaId].rows[0].values = { ...oldValues, ...newValues };
}

export { listSingleTolerateForCompare };
