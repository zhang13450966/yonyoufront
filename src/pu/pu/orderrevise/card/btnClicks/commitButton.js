/*
 * @Author: CongKe 
 * @PageInfo: 采购订单修订卡片提交 
 * @Date: 2018-06-20 18:23:03 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-07-06 09:57:10
 */
import { URL, FIELD, PAGECODE, TRANSFER, OrderReviseCache, STATUS } from '../../constance';
import { ajax, toast } from 'nc-lightapp-front';
import { pageInfoClick } from './index';
import { updateCacheData, deleteCacheData, addCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo, showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { updateExtBillDataForCompareByPk } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/compareUtils';
import { changeUrlParam, getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { buttonController } from '../viewController/index';

export default function commit(props, skipCodes, assign, Tran_S_C) {
	let _this = this;
	let forderstatus = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.forderstatus);
	if (forderstatus.value != FIELD.free && forderstatus.value != FIELD.unapproved) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004POORDER-000035') /* 国际化处理： 请选择状态为自由或者审批不通过的数据！*/
		});
		return;
	}
	let pk_order = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order);
	pk_order = pk_order && pk_order.value;
	pk_order = pk_order == null || pk_order == '' || pk_order == 'undefined' ? props.getUrlParam(FIELD.id) : pk_order;
	pk_order = pk_order == '' || pk_order == 'undefined' ? null : pk_order;
	let ts = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.ts).value;
	let allrows = _this.props.cardTable.getAllRows(PAGECODE.cardbody);
	let bodys = [];
	allrows.forEach((row) => {
		bodys.push({
			pks: row.values[FIELD.pk_order_b].value,
			ts: row.values[FIELD.ts].value
		});
	});
	let rows = [];
	let info = {
		pks: pk_order,
		ts: ts,
		bodys: bodys
	};
	rows.push(info);
	skipCodes = skipCodes ? skipCodes : new Array();
	let templetid = getDefData(OrderReviseCache.OrderReviseCacheKey, 'templetid');
	// 拼装json
	let data = {
		skipCodes: skipCodes,
		closedto: rows,
		pagecode: PAGECODE.cardcode,
		templetid: templetid
	};
	//指派
	if (assign) {
		data['assign'] = JSON.stringify(assign);
	}
	// 发送请求
	ajax({
		url: URL.commit,
		data: data,
		success: (res) => {
			// 卡片界面，在浏览态时勾选行，点修改后去掉勾选，付款协议和物料
			// props.cardTable.selectAllRows(PAGECODE.head_payment, false);
			props.cardTable.selectAllRows(PAGECODE.cardbody, false);
			if (
				res.data &&
				res.data.workflow &&
				(res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')
			) {
				_this.setState({
					compositedata: res.data,
					compositedisplay: true
				});
				return;
			}
			if (res.data && res.data.isResume && res.data.isResume == true) {
				showResumeModal.bind(this)(
					props,
					'ResumeMessageDlg',
					skipCodes,
					res.data,
					commit.bind(this, props, skipCodes, assign, Tran_S_C),
					props
				);
				return;
			} else if (res.data) {
				let map = new Map();
				map.set('pk_payment', PAGECODE.head_payment);
				map.set('pk_order_b', PAGECODE.cardbody);
				let config = {
					headAreaId: PAGECODE.cardhead,
					bodyIdAndPkMap: map
				};

				let fbillstatus = res.data.head[PAGECODE.cardhead].rows[0].values.forderstatus.value;
				updateExtBillDataForCompareByPk(_this.props, res.data, config);
				// buttonController.cachedata.call(_this);
				let datasource = OrderReviseCache.OrderReviseCacheKey;

				if (fbillstatus == FIELD.approved) {
					let pkid = res.data.head[PAGECODE.cardhead].rows[0].values.pk_order.value;
					deleteCacheData(_this.props, FIELD.pk_order, pk_order, datasource);
					//updateCacheData(_this.props, FIELD.pk_order, pkid, res.data, PAGECODE.cardhead, datasource);
					addCacheData(_this.props, FIELD.pk_order, pkid, res.data, PAGECODE.cardhead, datasource);
					_this.props.cardTable.setTableData(
						PAGECODE.cardbody,
						res.data.bodys[PAGECODE.cardbody],
						null,
						true,
						true
					);
					_this.props.setUrlParam({
						status: STATUS.browse,
						id: pkid
					});
					pageInfoClick.call(this, _this.props);
				} else {
					_this.props.cardTable.updateTableData(
						_this.props,
						PAGECODE.cardbody,
						res.data.bodys[PAGECODE.cardbody]
					);
					updateCacheData(_this.props, FIELD.pk_order, pk_order, res.data, PAGECODE.cardhead, datasource);
				}

				// _this.props.cardTable.updateDataByRowId(PAGECODE.cardbody, res.data.bodys[PAGECODE.cardbody], true);

				_this.props.form.setFormStatus(PAGECODE.cardhead, STATUS.browse);
				let resultMessage = getLangByResId(this, '4004ORDERREVISE-000029'); /* 国际化处理： 提交成功！*/
				showSuccessInfo(resultMessage);
			}
			setTimeout(() => {
				buttonController.togglePageShow.call(_this, _this.props, null);
			}, 0);
		}
	});
}
