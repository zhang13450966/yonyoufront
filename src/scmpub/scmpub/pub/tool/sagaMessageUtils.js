/*
 * @Author: chaiwx
 * @PageInfo: saga相关消息工具
 * @Date: 2018-07-22 09:40:38 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-12-09 11:05:50
 */

/**
 * 显示saga错误信息提示框
 * @param {*} props 
 * @param {*} params 
 */
function showSagaErrorToast(props, params = {}) {
	props.socket.showToast({
		gtxid: params.gtxid,
		billpk: params.billpk
	});
}

export { showSagaErrorToast };
