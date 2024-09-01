/*
 * @Author: CongKe
 * @PageInfo: 页面功能描述
 * @Date: 2018-05-02 15:53:07
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 21:06:24
 */
import { ajax, toast } from 'nc-lightapp-front';
import {
	URL,
	PAGECODE,
	FIELD,
	OrderCache,
	STATUS,
	TRANSFER,
	TRANSFER20,
	TRANSFERZ2,
	TRANSFER30TO21,
	TRANSFER30TO21COOP,
	TRANSFERMULTI,
	TRANSFER49
} from '../../constance';
import { changeUrlParam, deleteCacheData, getNextId, getCurrentLastId } from '../../../../../scmpub/scmpub/pub/cache';
import { pageInfoClick, refresh } from './index';
import { showSuccessInfo, showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { buttonController } from '../viewController/index';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function deleteBtnClick(props) {
	let _this = this;
	showWarningDialog(getLangByResId(this, '4004POORDER-000041'), getLangByResId(this, '4004POORDER-000042'), {
		/* 国际化处理： 删除,确定要删除吗？*/
		beSureBtnClick: doDelete.bind(this, props)
	});
}

function doDelete(props) {
	let _this = this;
	let ts = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.ts);
	let pk_order = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order);
	pk_order = pk_order && pk_order.value;
	pk_order = pk_order == null || pk_order == '' || pk_order == 'undefined' ? props.getUrlParam(FIELD.id) : pk_order;
	pk_order = pk_order == '' || pk_order == 'undefined' ? null : pk_order;
	if (ts) {
		ts = ts.value;
	}
	let allrows = _this.props.cardTable.getAllRows(PAGECODE.cardbody);
	let bodys = [];
	allrows.forEach((row) => {
		bodys.push({
			pks: row.values[FIELD.pk_order_b].value,
			ts: row.values[FIELD.ts].value
		});
	});
	let delinfos = { deleteInfo: [] };
	delinfos.deleteInfo.push({ ts: ts, pks: pk_order, bodys: bodys });
	ajax({
		url: URL.delete,
		data: delinfos,
		success: (res) => {
			let transfer = props.getUrlParam(TRANSFER.transfer);
			let channelType = props.getUrlParam(TRANSFER.channelType);
			props.form.setFormStatus(PAGECODE.cardhead, STATUS.browse);
			let nextId = getNextId(props, pk_order, OrderCache.OrderCacheKey);
			deleteCacheData(props, FIELD.pk_order, pk_order, OrderCache.OrderCacheKey);
			if (transfer || channelType) {
				_this.indexstatus = {};
				if (props.transferTable.getTransformFormAmount(PAGECODE.leftarea) == 1) {
					if (channelType) {
						// add by CongKe 推单取消需求变更
						_this.props.pushTo(URL.gotoList, { pagecode: PAGECODE.cardcode });
						// props.pushTo(_this.state.returnURL, {
						// 	type: _this.state.returnType,
						// 	appcode: _this.state.appcode,
						// });
					} else {
						let map = new Map();
						map.set('20', TRANSFER20.GOTO20);
						map.set('Z2', TRANSFERZ2.GOTOZ2);
						map.set('30TO21', TRANSFER30TO21.GOTO30SALE);
						map.set('30TO21COOP', TRANSFER30TO21COOP.GOTO30COOP);
						map.set('MULTI', TRANSFERMULTI.GOTOMULTI);
						map.set('49', TRANSFER49.GOTO49);
						let _url = map.get(transfer);

						let map2 = new Map();
						map2.set('20', TRANSFER20.PAGEID);
						map2.set('Z2', TRANSFERZ2.PAGEID);
						map2.set('30TO21', TRANSFER30TO21.PAGEID);
						map2.set('30TO21COOP', TRANSFER30TO21COOP.PAGEID);
						map2.set('MULTI', TRANSFERMULTI.PAGEID);
						map2.set('49', TRANSFER49.PAGEID);
						let pagecode = map2.get(transfer);
						props.pushTo(_url, {
							type: transfer,
							pagecode: pagecode
						});
					}
				} else {
					props.transferTable.setTransformFormStatus(PAGECODE.leftarea, {
						status: false,
						onChange: (current, next) => {
							showSuccessInfo(getLangByResId(_this, '4004POORDER-000043')); /* 国际化处理： 删除成功！*/
						}
					});
				}
			} else {
				showSuccessInfo(getLangByResId(_this, '4004POORDER-000043')); /* 国际化处理： 删除成功！*/
				nextId = nextId == null ? getCurrentLastId(OrderCache.OrderCacheKey) : nextId;
				changeUrlParam(props, { status: STATUS.browse, id: nextId });
				if (nextId == null) {
					props.form.EmptyAllFormValue(PAGECODE.cardhead); //订单
					props.cardTable.setTableData(PAGECODE.head_payment, { rows: [] }); //付款
					props.cardTable.setTableData(PAGECODE.cardbody, { rows: [] }); //物料
					buttonController.togglePageShow.call(this, this.props);
				} else {
					refresh.call(this, props, nextId, false);
				}
			}
		}
	});
}
