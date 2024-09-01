/*
 * @Author: xiahui 
 * @PageInfo: 列表态按钮状态控制 
 * @Date: 2019-01-15 13:41:29 
 * @Last Modified by: xiahui
 * @Last Modified time: 2019-06-25 16:38:14
 */
import { BUTTONID } from '../../constance';

function buttonControl(props, checkArr) {
	if (!checkArr || checkArr.length == 0) {
		// 没有选行
		props.button.setButtonDisabled([ BUTTONID.Confirm, BUTTONID.Delete, BUTTONID.Print, BUTTONID.Output ], true);
	} else {
		// 多行选中
		props.button.setButtonDisabled([ BUTTONID.Confirm, BUTTONID.Delete, BUTTONID.Print, BUTTONID.Output ], false);
	}

	this.forceUpdate(); // 重新设置按钮的显隐性后，不重新render，未找到根本原因，只能强制刷新下。
}

export { buttonControl };
