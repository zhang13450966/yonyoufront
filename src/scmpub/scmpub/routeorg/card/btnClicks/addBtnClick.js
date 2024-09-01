/*
 * @Author: 王勇 
 * @PageInfo: 卡片-增加运输路线  
 * @Date: 2020-01-17 09:34:06 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-03-08 15:54:44
 */
import { CARDTEMPLATEINFO, VIEWINFO, ROUTEVOINFO } from '../../const/index';
import buttonController from '../viewController/buttonController';

export default function addBtnClick(props) {
	props.form.EmptyAllFormValue(CARDTEMPLATEINFO.headAreaCode);
	props.cardTable.setTableData(CARDTEMPLATEINFO.bodyAreaCode, { rows: [] });
	buttonController.call(this, props, VIEWINFO.ADD_STATUS);
	if (this.pkorg_v) {
		//新增时设置默认组织
		props.form.setFormItemsValue(CARDTEMPLATEINFO.headAreaCode, {
			[ROUTEVOINFO.pk_org]: { value: this.pkorg, display: this.pkorg_name },
			[ROUTEVOINFO.pk_org_v]: { value: this.pkorg_v, display: this.pkorg_v_name }
		});
		this.current_org = { value: this.pkorg_v, display: this.pkorg_v_name };
	} else {
		props.initMetaByPkorg(ROUTEVOINFO.pk_org_v);
		props.form.setFormItemsDisabled(CARDTEMPLATEINFO.headAreaCode, { [ROUTEVOINFO.pk_org_v]: false });
	}
	props.form.setFormItemsValue(CARDTEMPLATEINFO.headAreaCode, {
		[ROUTEVOINFO.bsealflag]: { value: false, display: null }
	});
}
