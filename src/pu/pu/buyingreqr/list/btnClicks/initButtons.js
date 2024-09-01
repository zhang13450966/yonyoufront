/*设置按钮的禁用状态
 * @Author: mikey.zhangchqf 
 * @Date: 2018-07-04 20:34:03 
 * @Last Modified by: mikey.zhangchqf
 * @Last Modified time: 2018-09-28 19:12:48
 */

import { BUYINGREQ_LIST_BUTTON, BUYINGREQ_LIST } from '../../siconst';

export default function initButtons(props, flag) {
	
	let rows = props.table.getCheckedRows(BUYINGREQ_LIST.formId);
	let trueFlag = true;
	if (rows.length > 0) {
		trueFlag = false;
	}
	//初始化按钮都为不可用
	let disableArrdef = {
		[BUYINGREQ_LIST_BUTTON.File]: trueFlag, //取消
		[BUYINGREQ_LIST_BUTTON.QueryAboutBusiness]: trueFlag, //保存
		[BUYINGREQ_LIST_BUTTON.Print]: trueFlag, //打印
		[BUYINGREQ_LIST_BUTTON.output]: trueFlag, //输出
		[BUYINGREQ_LIST_BUTTON.Refresh]: false //刷新
	};
	props.button.setDisabled(disableArrdef);
}
