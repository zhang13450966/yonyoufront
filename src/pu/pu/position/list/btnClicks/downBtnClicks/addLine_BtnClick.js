/*
 * @Author: wangceb
 * @PageInfo: 删行按钮点击事件
 * @Date: 2018-05-21 15:05:52
 * @Last Modified by: wangceb
 * @Last Modified time: 2019-03-11 16:55:01
 */

import { POSITION_CONST, URL } from '../../../const';
import buttonController from '../../viewController/buttonController';
import { getBodyDefaultValue } from '../util';

export default function addLine_BtnClick(props, record, index) {
	this.props.cardTable.addRow(POSITION_CONST.DOWNTABLEID, undefined, getBodyDefaultValue.call(this), false);
	buttonController.call(this, this.props, POSITION_CONST.EDIT_STATUS);
}
