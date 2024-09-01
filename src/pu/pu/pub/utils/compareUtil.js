/*
 * @Author: xiahui 
 * @PageInfo: 差异操作
 * @Date: 2019-01-02 09:12:11 
 * @Last Modified by: xiahui
 * @Last Modified time: 2019-01-03 15:28:31
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
