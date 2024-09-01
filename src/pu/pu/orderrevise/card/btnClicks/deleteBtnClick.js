/*
 * @Author: CongKe 
 * @PageInfo: 页面功能描述 
 * @Date: 2018-05-02 15:53:07 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-06-21 16:35:12
 */
import { ajax, toast } from 'nc-lightapp-front';
import { URL, PAGECODE, FIELD, STATUS, OrderReviseCache } from '../../constance';
import { changeUrlParam, deleteCacheData, getNextId } from '../../../../../scmpub/scmpub/pub/cache';
import { pageInfoClick } from './index';
import { showSuccessInfo, showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function deleteBtnClick(props) {
	showWarningDialog(getLangByResId(this, '4004ORDERREVISE-000032'), getLangByResId(this, '4004ORDERREVISE-000033'), {
		/* 国际化处理： 删除,确定要删除吗？*/
		beSureBtnClick: doDelete.bind(this, props)
	});
}

function doDelete(props) {
	let _this = this;
	let pk_order = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order);
	let pk_srcorder = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_srcorder).value;
	let ts = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.ts);
	let allrows = _this.props.cardTable.getAllRows(PAGECODE.cardbody);
	let bodys = [];
	pk_order = pk_order && pk_order.value;
	pk_order = pk_order == null || pk_order == '' || pk_order == 'undefined' ? props.getUrlParam(FIELD.id) : pk_order;
	pk_order = pk_order == '' || pk_order == 'undefined' ? null : pk_order;
	if (ts) {
		ts = ts.value;
	}
	allrows.forEach((row) => {
		bodys.push({
			pks: row.values[FIELD.pk_order_b].value,
			ts: row.values[FIELD.ts].value
		});
	});
	// 执行删除操作
	let delinfos = { deleteInfo: [] };
	delinfos.deleteInfo.push({ ts: ts, pks: pk_order, bodys: bodys });
	ajax({
		url: URL.delete,
		data: delinfos,
		success: (res) => {
			toast({
				color: 'success',
				content: getLangByResId(this, '4004ORDERREVISE-000008') /* 国际化处理： 删除成功！*/
			});
			deleteCacheData(props, FIELD.pk_order, props.getUrlParam('id'), OrderReviseCache.OrderReviseCacheKey);
			let nextId = pk_srcorder;
			changeUrlParam(props, {
				status: STATUS.browse,
				id: nextId
			});
			pageInfoClick.call(this, _this.props);
		}
	});
}
