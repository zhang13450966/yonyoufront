/*
 * @Author: guoylei 
 * @PageInfo: 打开草稿
 * @Date: 2021-07-13 15:17:31 
 * @Last Modified by: guoylei 
 * @Last Modified time: 2021-07-13 15:17:31 
 */
import { changeUrlParam, setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { STOREREQ_CARD, ATTRCODE, STOREREQ_CARD_BUTTON } from '../../siconst/siconst';
import buttonController from '../viewControl/buttonController';

export default function temporaryClick(props, tempdata) {
	let empty = {
		value: null,
		display: null,
		scale: '-1'
	};
	this.props.cardTable.setStatus(STOREREQ_CARD.tableId, STOREREQ_CARD.edit);
	this.props.form.setFormStatus(STOREREQ_CARD.formId, STOREREQ_CARD.edit);
	// buttonController.setCardButtonVisiable.call(this, props, status);
	//设置页面状态
	//buttonControl.call(this, this.props, STOREREQ_CARD.edit);

	changeUrlParam(this.props, { status: STOREREQ_CARD.add, tempstatus: STOREREQ_CARD.add });
	let pk_org_v = null;
	//清空主键和表头
	this.props.form.setFormItemsValue(STOREREQ_CARD.formId, { [ATTRCODE.pk_storereq]: empty });
	this.props.form.EmptyAllFormValue(STOREREQ_CARD.formId);

	if (!tempdata) {
		this.props.initMetaByPkorg(STOREREQ_CARD.pk_org_v);
	}

	//清空表体数据
	this.props.cardTable.setTableData(STOREREQ_CARD.tableId, { rows: [] }); //表体

	// 暂存
	if (tempdata) {
		setDefData(STOREREQ_CARD.tempCardCacheKey, 'tempsave', true);
		let billcodeStr = tempdata.head[STOREREQ_CARD.formId].rows[0].values.vbillcode.value;
		//设置表头表体数据
		this.props.form.setAllFormValue({ [STOREREQ_CARD.formId]: tempdata.head[STOREREQ_CARD.formId] });
		if (tempdata.body) {
			this.props.cardTable.setTableData(
				STOREREQ_CARD.tableId,
				tempdata.body[STOREREQ_CARD.tableId],
				null,
				true,
				true
			);
		}

		this.props.BillHeadInfo.setBillHeadInfoVisible({
			billCode: billcodeStr //修改单据号---非必传
		});
		let pkorgValue = tempdata.head[STOREREQ_CARD.formId].rows[0].values.pk_org_v.value;
		if (pkorgValue) {
			pk_org_v = pkorgValue;
			this.props.resMetaAfterPkorgEdit();
		}
	}
	// 按钮控制要放在设置数据之后，否则无法根据暂存渲染到页面数据控制按钮
	buttonController.setCardButtonVisiable.call(this, props, status);
	//设置暂存按钮可用
	this.props.button.setDisabled([ STOREREQ_CARD_BUTTON.TemporaryStorage ], false);
}
