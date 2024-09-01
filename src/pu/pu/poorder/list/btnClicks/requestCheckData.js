/*
 * @Author: CongKe 
 * @PageInfo: 页面功能描述 
 * @Date: 2018-09-11 14:14:05 
 * @Last Modified by: CongKe
 * @Last Modified time: 2018-12-07 11:27:59
 */
import { ajax } from 'nc-lightapp-front';
import { URL } from '../../constance';
import { showWarningInfo, showErrorDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil.js';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function requestCheckData(data, content, callBack) {
	ajax({
		url: URL.sysinitgroup,
		data: [ data ],
		method: 'post',
		success: (res) => {
			if (res && res.data && res.data[data]) {
				callBack && callBack();
			} else {
				showErrorDialog(null, content); /* 国际化处理： 合同模块未启用！*/
			}
		}
	});
}
