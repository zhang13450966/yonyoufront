/*
 * @Author: 王勇 
 * @PageInfo: 卡片-运输路线-插行  
 * @Date: 2020-01-17 09:39:12 
 * @Last Modified by: 王勇 
 * @Last Modified time: 2020-01-17 09:39:12 
 */
import { CARDTEMPLATEINFO,VIEWINFO } from '../../const/index';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import buttonController from '../viewController/buttonController';

export default function innerInsLineClick(props,index) {
	props.cardTable.addRow(CARDTEMPLATEINFO.bodyAreaCode);
	RownoUtils.setRowNo(props, CARDTEMPLATEINFO.bodyAreaCode);
	buttonController.call(this, props,VIEWINFO.EDIT_STATUS);
}