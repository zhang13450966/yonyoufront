/*
 * @Author: CongKe 
 * @PageInfo: 采购订单收回 
 * @Date: 2018-06-20 18:23:03 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-11-11 16:28:42
 */
import { URL, FIELD, PAGECODE, TRANSFER, OrderCache, STATUS } from '../../constance';
import { ajax, toast } from 'nc-lightapp-front';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';
import { updateCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import { buttonController } from '../viewController/index';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo, showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { updateExtBillDataForCompareByPk } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/compareUtils';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';

export default function commit() {
	let _this = this;
	// 获取选中行
	let forderstatus = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.forderstatus);
	// if (forderstatus != FIELD.approve && forderstatus != FIELD.commit) {
	// 	toast({
	// 		color: 'warning',
	// 		content: '请选择审批中或是执行中的数据！'
	// 	});
	// 	return;
	// }
	let pk_order = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order);
	pk_order = pk_order && pk_order.value;
	pk_order = pk_order == null || pk_order == '' || pk_order == 'undefined' ? props.getUrlParam(FIELD.id) : pk_order;
	pk_order = pk_order == '' || pk_order == 'undefined' ? null : pk_order;
	let ts = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.ts).value;
	let allrows = this.props.cardTable.getAllRows(PAGECODE.cardbody);
	let bodys = [];
	allrows.forEach((row) => {
		bodys.push({
			pks: row.values[FIELD.pk_order_b].value,
			ts: row.values[FIELD.ts].value
		});
	});
	// 执行删除操作
	let delRows = [];
	let info = {
		pks: pk_order,
		ts: ts,
		bodys: bodys
	};
	delRows.push(info);
	let templetid = getDefData(OrderCache.OrderCardCache, 'templetid');
	// 拼装json
	let data = {
		closedto: delRows,
		pagecode: PAGECODE.cardcode,
		templetid: templetid
	};
	// 发送请求
	ajax({
		url: URL.uncommit,
		data: data,
		success: (res) => {
			if (res.data.isResume && res.data.isResume == true) {
				showResumeModal.bind(this)(
					_this.props,
					'ResumeMessageDlg',
					skipCodes,
					res.data,
					saveButton,
					_this.props
				);
				return;
			} else {
				if (res.data) {
					let map = new Map();
					map.set('pk_payment', PAGECODE.head_payment);
					map.set('pk_order_b', PAGECODE.cardbody);
					let config = {
						headAreaId: PAGECODE.cardhead,
						bodyIdAndPkMap: map
					};
					updateExtBillDataForCompareByPk(_this.props, res.data, config);
					buttonController.cachedata.call(_this);
					let datasource = OrderCache.OrderCacheKey;
					let transfer = _this.props.getUrlParam(TRANSFER.transfer);
					let channelType = _this.props.getUrlParam(TRANSFER.channelType);
					if (transfer || channelType) {
						datasource = OrderCache.OrderTransferCache;
					}
					updateCacheData(_this.props, FIELD.pk_order, pk_order, res.data, PAGECODE.cardhead, datasource);
					_this.props.form.setFormStatus(PAGECODE.cardhead, STATUS.browse);
				}
			}
			setTimeout(() => {
				buttonController.togglePageShow.call(_this, _this.props, null);
			}, 0);
			if (res.success) {
				showSuccessInfo(getLangByResId(this, '4004POORDER-000052')); /* 国际化处理： 收回成功！*/
			} else {
				showErrorInfo(null, getLangByResId(this, '4004POORDER-000053')); /* 国际化处理：收回失败！*/
			}
		}
	});
}
