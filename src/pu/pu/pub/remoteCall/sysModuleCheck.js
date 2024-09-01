/*
 * @Author: CongKe
 * @PageInfo: 公共模块启用判断
 * @Date: 2018-09-11 14:14:05
 * @Last Modified by: CongKe
 * @Last Modified time: 2020-03-20 10:03:07
 */
import { ajax } from 'nc-lightapp-front';
import { showErrorInfo } from '../../../../scmpub/scmpub/pub/tool/messageUtil.js';

export default function sysModuleCheck(data, content, callBack) {
	ajax({
		url: '/nccloud/scmpub/pub/sysinitgroup.do', //公共模块启用判断
		data: [data],
		method: 'post',
		success: res => {
			if (res && res.data && res.data[data]) {
				callBack && callBack();
			} else {
				showErrorInfo(null, content); /* 国际化处理： 模块未启用！*/
			}
		},
	});
}
