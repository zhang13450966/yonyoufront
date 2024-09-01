/*
 * @Author: 王龙华 
 * @PageInfo:修改按钮点击事件 
 * @Date: 2018-04-11 15:40:15 
 * @Last Modified by: yinliangc
 * @Last Modified time: 2022-05-17 17:57:37
 */
import { INVSOURCE_CONST } from '../../const';
import buttonController from '../../list/viewController/buttonController';

export default function editBtnClick(props, id) {
	buttonController.call(this, props, INVSOURCE_CONST.EDIT_STATUS);
}
