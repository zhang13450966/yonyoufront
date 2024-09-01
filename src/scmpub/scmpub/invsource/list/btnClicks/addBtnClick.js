/*
 * @Author: 王龙华 
 * @PageInfo: 新增按钮点击事件
 * @Date: 2018-04-11 11:01:05 
 * @Last Modified by: yinliangc
 * @Last Modified time: 2022-05-17 17:57:24
 */
import { INVSOURCE_CONST } from '../../const';
import buttonController from '../../list/viewController/buttonController';

export default function addBtnClick(props, id) {
	props.editTable.addRow(INVSOURCE_CONST.TABLEID, undefined, true);
	buttonController.call(this, props, INVSOURCE_CONST.EDIT_STATUS);
}
