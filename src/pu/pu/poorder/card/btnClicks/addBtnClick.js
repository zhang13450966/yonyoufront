/*
 * @Author: zhaochyu
 * @PageInfo: 采购订单新增
 * @Date: 2019-05-08 14:09:44
 * @Last Modified by: guoylei
 * @Last Modified time: 2021-07-05 16:14:12
 */
import { PAGECODE, STATUS, FIELD, OrderCache, BUTTON } from '../../constance';
import { afterEvents } from '../afterEvents';
import { changeUrlParam, getDefData, setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import buttonController from '../viewController/buttonController';

export default function addBtnClick(props, tempdata) {
	let empty = {
		value: null,
		display: null,
		scale: '-1'
	};
	this.setState({ status: STATUS.edit });
	changeUrlParam(this.props, { id: null, status: STATUS.add, tempstatus: STATUS.add });
	let pk_org_v = null;
	this.props.form.setFormItemsValue(PAGECODE.cardhead, { [FIELD.pk_order]: empty });
	this.props.form.EmptyAllFormValue(PAGECODE.cardhead); //订单
	this.props.form.setFormItemsValue(PAGECODE.cardhead, {
		[FIELD.forderstatus]: {
			value: '0',
			display: getLangByResId(this, '4004POORDER-000020')
		} /* 国际化处理： 自由*/
	});
	if (!tempdata) {
		this.props.initMetaByPkorg(FIELD.pk_org_v);
	}
	this.props.cardTable.setTableData(PAGECODE.head_payment, { rows: [] }); //付款
	this.props.cardTable.setTableData(PAGECODE.cardbody, { rows: [] });
	pk_org_v = getDefData(OrderCache.OrderCardCache, FIELD.pk_org_v);
	let org_v_Name = getDefData(OrderCache.OrderCardCache, 'pk_org_v_name');
	// 暂存
	if (tempdata) {
		setDefData(OrderCache.OrderCardCache, 'tempsave', true);
		let billcodeStr = tempdata.head[PAGECODE.cardhead].rows[0].values.vbillcode.value;
		this.props.form.setAllFormValue({ [PAGECODE.cardhead]: tempdata.head[PAGECODE.cardhead] });
		if (tempdata.bodys) {
			this.props.cardTable.setTableData(PAGECODE.cardbody, tempdata.bodys[PAGECODE.cardbody], null, true, true);
			this.props.cardTable.setTableData(
				PAGECODE.head_payment,
				tempdata.bodys[PAGECODE.head_payment],
				null,
				true,
				true
			);
		}

		this.props.BillHeadInfo.setBillHeadInfoVisible({
			billCode: billcodeStr //修改单据号---非必传
		});
		let pkorgValue = tempdata.head[PAGECODE.cardhead].rows[0].values.pk_org_v.value;
		if (pkorgValue) {
			pk_org_v = pkorgValue;
			this.props.resMetaAfterPkorgEdit();
		}
	} else if (pk_org_v) {
		let changeRow = { value: pk_org_v, display: org_v_Name };
		// let changeRow = { refpk: pk_org_v, refname: org_v_Name };
		let obj_pk_org_v = { value: pk_org_v, display: org_v_Name, scale: '-1', refpk: pk_org_v, refname: org_v_Name };
		// let obj_pk_org_v = { value: pk_org_v, display: org_v_Name, scale: '-1' };
		this.props.form.setFormItemsValue(PAGECODE.cardhead, { [FIELD.pk_org_v]: obj_pk_org_v });
		afterEvents.call(this, this.props, PAGECODE.cardhead, FIELD.pk_org_v, obj_pk_org_v, changeRow);
	}
	//物料
	setTimeout(() => {
		buttonController.togglePageShow.call(this, this.props, STATUS.edit, pk_org_v);
		this.props.form.setFormItemsDisabled(PAGECODE.cardhead, { pk_org_v: false });
	}, 0);
	//add by zhaochyu暂存功能
	this.props.button.setDisabled({ [BUTTON.TemporaryStorage]: false });
}
