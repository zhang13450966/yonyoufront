/*
 * @Author: jiangfw 
 * @PageInfo: 新增  
 * @Date: 2018-04-25 20:46:23 
 * @Last Modified by: guoylei
 * @Last Modified time: 2021-08-26 10:13:43
 */
import { UISTATE, FIELD, COMMON } from '../../constance';
import { getDefData, changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';
import { afterEvent } from '../afterEvents';
import btnController from '../viewControl/btnController';

export default function clickAddBtn() {
	// 清除表头表体数据
	clearData.call(this);
	// 设置财务组织默认值
	let pk_org_v = getDefData(COMMON.PuinvoiceCacheKey, FIELD.pk_org_v);
	let org_v_Name = getDefData(COMMON.PuinvoiceCacheKey, 'org_v_Name');
	if (pk_org_v && org_v_Name) {
		afterEvent.call(this, this.props, this.formId, FIELD.pk_org_v, { value: pk_org_v, display: org_v_Name }, null, {
			refpk: pk_org_v,
			refname: org_v_Name
		});
	}
	// 表头字段编辑性控制
	this.props.initMetaByPkorg(FIELD.pk_org_v);
	changeUrlParam(this.props, { status: UISTATE.add, option: UISTATE.add });
	btnController.call(this, UISTATE.add);
}

function clearData() {
	this.setBillHeadInfo();
	this.props.form.EmptyAllFormValue(this.formId);
	this.props.cardTable.setTableData(this.tableId, { rows: [] });
}
