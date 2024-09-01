/*
 * @Author: CongKe 
 * @PageInfo: 生成付款计划
 * @Date: 2018-08-30 19:34:11 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-04-06 15:00:42
 */
import { URL, STATUS, FIELD, PAGECODE, APPCODE } from '../../constance';
import { toast } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function payPlan(props) {
	let pk_order = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order);
	let forderstatus = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.forderstatus); // 单据状态
	pk_order = pk_order && pk_order.value;
	forderstatus = forderstatus && forderstatus.value;
	//单选且审批过的单据可用openTO付款计划
	if (forderstatus == FIELD.approved) {
		props.openTo(URL.payplan, {
			id: pk_order,
			appcode: APPCODE.payplanAppCode,
			pagecode: '400400806_list',
			pk_org: JSON.stringify(props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org)),
			vbillcode: props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.vbillcode).value,
			dbilldate: props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.dbilldate).value
		});
	} else {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004POORDER-000047') /* 国际化处理： 请选择审批通过的数据！*/
		});
	}
}
