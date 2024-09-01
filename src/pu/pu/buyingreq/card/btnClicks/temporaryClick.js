/*
 * @Author: guoylei 
 * @PageInfo: 打开草稿
 * @Date: 2021-07-13 15:17:31 
 * @Last Modified by: guoylei 
 * @Last Modified time: 2021-07-13 15:17:31 
 */
import { changeUrlParam, setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { BUYINGREQ_CARD, ATTRCODE, BUYINGREQ_CARD_BUTTON } from '../../siconst/siconst';
import { buttonController } from '../viewControl';

export default function temporaryClick(props, tempdata) {
	let empty = {
		value: null,
		display: null,
		scale: '-1'
	};
	this.props.cardTable.setStatus(BUYINGREQ_CARD.tableId, BUYINGREQ_CARD.edit);
	this.props.form.setFormStatus(BUYINGREQ_CARD.formId, BUYINGREQ_CARD.edit);
	//设置页面状态
	buttonController.setCardButtonVisiable.call(this, this.props, BUYINGREQ_CARD.edit);

	changeUrlParam(this.props, { id: null, status: BUYINGREQ_CARD.add, tempstatus: BUYINGREQ_CARD.add });
	let pk_org_v = null;
	//清空主键和表头
	this.props.form.setFormItemsValue(BUYINGREQ_CARD.formId, { [ATTRCODE.pk_praybill]: empty });
	this.props.form.EmptyAllFormValue(BUYINGREQ_CARD.formId);

	if (!tempdata) {
		this.props.initMetaByPkorg(BUYINGREQ_CARD.pk_org_v);
	}

	//清空表体数据
	this.props.cardTable.setTableData(BUYINGREQ_CARD.tableId, { rows: [] }); //表体

	// 暂存
	if (tempdata) {
		setDefData(BUYINGREQ_CARD.tempCardCacheKey, 'tempsave', true);
		let billcodeStr = tempdata.head[BUYINGREQ_CARD.formId].rows[0].values.vbillcode.value;
		//设置表头表体数据
		this.props.form.setAllFormValue({ [BUYINGREQ_CARD.formId]: tempdata.head[BUYINGREQ_CARD.formId] });
		if (tempdata.body) {
			this.props.cardTable.setTableData(
				BUYINGREQ_CARD.tableId,
				tempdata.body[BUYINGREQ_CARD.tableId],
				null,
				true,
				true
			);
		}

		this.props.BillHeadInfo.setBillHeadInfoVisible({
			billCode: billcodeStr //修改单据号---非必传
		});
		let pkorgValue = tempdata.head[BUYINGREQ_CARD.formId].rows[0].values.pk_org_v.value;
		if (pkorgValue) {
			pk_org_v = pkorgValue;
			this.props.resMetaAfterPkorgEdit();
		}
	}
	//设置暂存按钮可用
	this.props.button.setDisabled({ [BUYINGREQ_CARD_BUTTON.TemporaryStorage]: false });
}
