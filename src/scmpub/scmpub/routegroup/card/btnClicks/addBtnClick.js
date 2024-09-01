/*
 * @Author: 王勇 
 * @PageInfo: 卡片-增加运输路线  
 * @Date: 2020-01-17 09:34:06 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-10-24 16:47:10
 */
import { CARDTEMPLATEINFO, VIEWINFO, ROUTEVOINFO } from '../../const/index';
import buttonController from '../viewController/buttonController';
import innerAddLineClick from './innerAddLineBtnClick';

export default function addBtnClick(props) {
	props.form.EmptyAllFormValue(CARDTEMPLATEINFO.headAreaCode);
	props.cardTable.setTableData(CARDTEMPLATEINFO.bodyAreaCode, { rows: [] });
	props.form.setFormStatus(CARDTEMPLATEINFO.headAreaCode, VIEWINFO.EDIT_STATUS);
	props.cardTable.setStatus(CARDTEMPLATEINFO.bodyAreaCode, VIEWINFO.EDIT_STATUS);
	props.form.setFormItemsValue(CARDTEMPLATEINFO.headAreaCode, {
		[ROUTEVOINFO.bsealflag]: { value: false, display: null }
	});
	innerAddLineClick.call(this, props);
	buttonController.call(this, props, VIEWINFO.EDIT_STATUS);
	// props.updatePage(CARDTEMPLATEINFO.headAreaCode, CARDTEMPLATEINFO.bodyAreaCode);
}
