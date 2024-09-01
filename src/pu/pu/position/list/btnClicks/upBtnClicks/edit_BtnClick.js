/*
 * @Author: wangceb
 * @PageInfo: 修改按钮点击事件
 * @Date: 2018-05-21 15:05:52
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-07-13 16:36:56
 */

import { POSITION_CONST } from '../../../const';
import buttonController from '../../../list/viewController/buttonController';
export default function edit_BtnClick(props, record, index) {
	this.props.cardTable.focusRowByIndex(POSITION_CONST.UPTABLEID, index);
	// 控制按钮状态
	buttonController.call(this, props, POSITION_CONST.EDIT_STATUS);
}
