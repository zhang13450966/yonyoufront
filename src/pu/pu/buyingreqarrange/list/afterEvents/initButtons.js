/*设置按钮的禁用状态
 * @Author: mikey.zhangchqf 
 * @Date: 2018-07-04 20:34:03 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2019-01-04 16:37:58
 */

import { BUYINGREQ_LIST_BUTTON, BUYINGREQ_LIST, FBILLSTATUS } from '../../siconst';

export default function initButtons(props, flag) {
	if (!this.state.showSearch) {
		return;
	}
	// 初始化全部不可见
	let Edit = true;
	let BatchArrange = true;
	let CancelArrange = true;
	let Refresh = false;
	let Cancel = true;
	let Save = true;
	//判断标志为true则为：查询已安排数据；为false：查询未安排数据
	if (flag == true) {
		CancelArrange = false;
	} else {
		Edit = false;
		let checkData = props.editTable.getCheckedRows(BUYINGREQ_LIST.formId);
		if (checkData.length > 0) {
			BatchArrange = false;
		}
	}

	let disableArr = {
		[BUYINGREQ_LIST_BUTTON.Edit]: Edit, //安排
		[BUYINGREQ_LIST_BUTTON.BatchArrange]: BatchArrange, //批量安排
		[BUYINGREQ_LIST_BUTTON.CancelArrange]: CancelArrange, //取消安排
		[BUYINGREQ_LIST_BUTTON.Refresh]: Refresh, //刷新
		[BUYINGREQ_LIST_BUTTON.Cancel]: Cancel, //取消
		[BUYINGREQ_LIST_BUTTON.Save]: Save //保存
	};
	props.button.setDisabled(disableArr);
}
