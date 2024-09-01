/*
 * @Author: CongKe
 * @PageInfo: saga相关消息工具
 * @Date: 2018-07-22 09:40:38
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-12-09 11:37:21
 */
import { showSagaErrorToast } from '../../../../scmpub/scmpub/pub/tool/sagaMessageUtils';

/**
 * 显示saga错误信息提示框
 * @param {*} props
 * @param {*} params
 */
function showSagaErrorToasts(props, formId, billpkName, params = {}) {
	let saga_gtxid = props.form.getFormItemsValue(formId, 'saga_gtxid');
	let billPk = props.form.getFormItemsValue(formId, billpkName);
	params.gtxid = saga_gtxid && saga_gtxid.value;
	params.billpk = billPk && billPk.value;
	showSagaErrorToast(props, params);
}

export { showSagaErrorToasts };
