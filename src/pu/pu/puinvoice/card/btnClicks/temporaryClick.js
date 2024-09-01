/*
 * @Author: guoylei 
 * @PageInfo: 打开草稿
 * @Date: 2021-07-13 15:17:31 
 * @Last Modified by: guoylei 
 * @Last Modified time: 2021-07-13 15:17:31 
 */
import { changeUrlParam, setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { AREA, FIELD, UISTATE, COMMON, BUTTONID } from '../../constance';
import buttonControl from '../viewControl/btnController';

export default function temporaryClick(props, tempdata) {
	let empty = {
		value: null,
		display: null,
		scale: '-1'
	};
	this.props.cardTable.setStatus(AREA.card_body, UISTATE.edit);
	this.props.form.setFormStatus(AREA.card_head, UISTATE.edit);
	//设置页面状态
	buttonControl.call(this, this.props, UISTATE.edit);

	changeUrlParam(this.props, { status: UISTATE.add, tempstatus: UISTATE.add });
	let pk_org_v = null;
	//清空主键和表头
	this.props.form.setFormItemsValue(AREA.card_head, { [FIELD.pk_invoice]: empty });
	this.props.form.EmptyAllFormValue(AREA.card_head);

	if (!tempdata || !tempdata.head.card_head.rows[0].values.pk_org_v.value) {
		this.props.initMetaByPkorg(FIELD.pk_org_v);
	}

	//清空表体数据
	this.props.cardTable.setTableData(AREA.card_body, { rows: [] }); //表体

	// 暂存
	if (tempdata) {
		setDefData(COMMON.tempCardCacheKey, 'tempsave', true);
		let billcodeStr = tempdata.head[AREA.card_head].rows[0].values.vbillcode.value;
		//设置表头表体数据
		this.props.form.setAllFormValue({ [AREA.card_head]: tempdata.head[AREA.card_head] });
		if (tempdata.bodys) {
			this.props.cardTable.setTableData(AREA.card_body, tempdata.bodys[AREA.card_body], null, true, true);
		}

		this.props.BillHeadInfo.setBillHeadInfoVisible({
			billCode: billcodeStr //修改单据号---非必传
		});
		let pkorgValue = tempdata.head[AREA.card_head].rows[0].values.pk_org_v.value;
		if (pkorgValue) {
			pk_org_v = pkorgValue;
			this.props.resMetaAfterPkorgEdit();
		}
	}
	//设置暂存按钮可用
	this.props.button.setDisabled({ [BUTTONID.TemporaryStorage]: false });
}
