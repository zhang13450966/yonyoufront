/*
 * @Author: 王龙华 
 * @PageInfo: 行操作按钮
 * @Date: 2018-05-30 15:04:49 
 * @Last Modified by: 王龙华
 * @Last Modified time: 2018-05-31 17:03:07
 */
import { deleteLineBtnClick } from '../btnClicks';
import { INVSOURCE_CONST } from '../../const';

export default function(props, record, index) {
	return props.button.createOprationButton(INVSOURCE_CONST.DELETEBUTTON, {
		onButtonClick: (props, key) => deleteLineBtnClick.bind(this)(props, record, index),
		area: INVSOURCE_CONST.BODYAREA,
		buttonLimit: 3
	});
}
