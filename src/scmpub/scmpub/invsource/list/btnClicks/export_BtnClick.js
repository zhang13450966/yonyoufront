/*
 * @Author: 王龙华 
 * @PageInfo: 导出按钮点击事件 
 * @Date: 2018-07-29 17:03:57 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-08-26 19:22:14
 */

import { formDownload } from 'nc-lightapp-front';
import { INVSOURCE_CONST } from '../../const';

export default function export_BtnClick(props) {
	formDownload({
		params: { outputSetting: null },
		url: INVSOURCE_CONST.EXPORT_URL,
		enctype: 1
	});
}
