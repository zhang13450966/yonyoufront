/*
 * @Author: 王勇 
 * @PageInfo: 卡片-编辑运输路线  
 * @Date: 2020-01-17 09:36:34 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-09-28 16:24:27
 */

import { CARDTEMPLATEINFO, VIEWINFO, ROUTEVOINFO } from '../../const/index';
import buttonController from '../viewController/buttonController';

export default function editBtnClick(props) {
	buttonController.call(this, props, VIEWINFO.EDIT_STATUS);
	//控制第一行间距、里程不可编辑
	props.cardTable.setEditableByIndex(
		CARDTEMPLATEINFO.bodyAreaCode,
		0,
		[ [ ROUTEVOINFO.space ], [ ROUTEVOINFO.nmileage ] ],
		false
	);
}
