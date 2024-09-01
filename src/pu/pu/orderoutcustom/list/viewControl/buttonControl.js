/*
 * @Author: liujia9 
 * @PageInfo: 列表态按钮状态控制 
 * @Date: 2019-01-15 13:41:29 
 * @Last Modified by: liujia9
 * @Last Modified time: 2019-04-16 15:27:58
 */
import { BUTTONID } from '../../constance';

function buttonControl(props, checkArr) {
	if (!checkArr || checkArr.length == 0) {
		// 没有选行
		props.button.setDisabled({ [BUTTONID.Print]: true });
	} else {
		props.button.setDisabled({ [BUTTONID.Print]: false });
	}
}

export { buttonControl };
