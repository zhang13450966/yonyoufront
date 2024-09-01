/*
 * @Author: 王勇 
 * @PageInfo: 卡片-运输路线-插行  
 * @Date: 2020-01-17 09:39:12 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-03-01 11:32:26
 */
import { CARDTEMPLATEINFO, VIEWINFO, ROUTEVOINFO } from '../../const/index';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import buttonController from '../viewController/buttonController';

export default function innerInsLineClick(props, index) {
	props.cardTable.addRow(CARDTEMPLATEINFO.bodyAreaCode, index, setRowDefaultValue(props));
	RownoUtils.setRowNo(props, CARDTEMPLATEINFO.bodyAreaCode);
	buttonController.call(this, props, VIEWINFO.EDIT_STATUS);
}

function setRowDefaultValue(props) {
	let rowdata = {
		[ROUTEVOINFO.space]: 1,
		[ROUTEVOINFO.nmileage]: 1
	};
	return rowdata;
}
