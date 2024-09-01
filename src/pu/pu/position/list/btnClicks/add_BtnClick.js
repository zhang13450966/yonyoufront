/*
 * @Author: 王龙华
 * @PageInfo: 页面功能描述
 * @Date: 2018-05-21 15:24:24
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-13 15:24:43
 */
import { POSITION_CONST } from '../../const';
import buttonController from '../../list/viewController/buttonController';
import { doAddAction } from 'scmpub/scmpub/components/VerticalEditTable';
import { getHeadDefaultValue, getBodyDefaultValue } from './util';
export default function add_BtnClick(props) {
	let upTableConfig = {
		moduleId: POSITION_CONST.UPTABLEID,
		data: getHeadDefaultValue.call(this)
	};
	let downTableConfig = {
		moduleId: POSITION_CONST.DOWNTABLEID,
		data: getBodyDefaultValue.call(this)
	};
	doAddAction.call(this, upTableConfig, downTableConfig);
	buttonController.call(this, props, POSITION_CONST.EDIT_STATUS);
}
