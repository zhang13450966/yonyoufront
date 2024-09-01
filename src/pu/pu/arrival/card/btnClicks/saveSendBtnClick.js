/*
 * @Author: zhangshqb 
 * @PageInfo: 保存并提交  
 * @Date: 2018-04-28 10:17:14 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-07-27 09:57:34
 */
import { ajax, toast } from 'nc-lightapp-front';
import { showSuccessInfo, showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { URL, COMMON, AREA, PAGECODE, FIELD } from '../../constance';
import {
	changeUrlParam,
	updateCacheData,
	addCacheData,
	rewriteTransferSrcBids,
	getCacheDataByPk
} from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import buttonController from '../viewControl/buttonController';
import cancelPastBtnClick from './cancelPastBtnClick';
export default function() {
	let _this = this;
	let formIds = [ AREA.head ];

	props.cardTable.filterEmptyRows(AREA.body, [ FIELD.pk_material ], 'include');
	if (!props.cardTable.getAllRows(AREA.body).length) {
		showWarningInfo(null, getLangByResId(this, '4004ARRIVAL-000066')); /* 国际化处理： 表体为空*/
		return;
	}
	let flag = _this.props.validatePageToToast([
		{
			// creteForm 使用的areaCode
			name: [ AREA.head ],
			type: 'form'
		},
		{
			// createCardTable的areaCode，多页签区域填主表就行
			name: AREA.body,
			type: 'cardTable'
		}
	]);
	if (!flag.allPassed) {
		return;
	}
	cancelPastBtnClick.call(_this);
	let data = _this.props.createMasterChildDataSimple(PAGECODE.card, AREA.form, AREA.body);

	let pk_arriveorder = _this.props.form.getFormItemsValue(AREA.head, 'pk_arriveorder');
	if (pk_arriveorder && pk_arriveorder.value != null) {
	} else {
		let arows = [];
		data.body.body.rows.map((item) => {
			let sta = item.status;
			if (sta != 3) {
				arows.push(item);
			}
		});
		data.body.body.rows = arows;
	}
	let rows = data.body.body.rows;
	rows.forEach((row, index) => {
		row.values.pseudocolumn.value = index + '';
	});
	ajax({
		method: 'post',
		url: URL.saveSend,
		data: data,
		success: function(res) {
			if (res.data.errorMsg) {
				if (_this.props.getUrlParam('type')) {
					let bill = res.data.card;
					rewriteTransferSrcBids(_this.props, 'csourcebid', bill.body[AREA.body].rows);
					// 转单编辑界面保存
					addCacheData(
						_this.props,
						'pk_arriveorder',
						bill.head[AREA.form].rows[0].values.pk_arriveorder.value,
						bill,
						AREA.form,
						COMMON.arrivalCacheKey
					);
					let msg = getLangByResId(_this, '4004ARRIVAL-000020'); /* 国际化处理： 保存成功,提交失败,失败原因：*/
					msg += res.data.errorMsg;
					_this.props.transferTable.setTransformFormStatus(AREA.leftarea, {
						status: false,
						onChange: (current, next, currentIndex) => {
							_this.props.transferTable.setTransferListValueByIndex(
								AREA.leftarea,
								res.data.card,
								currentIndex
							);
							toast({ color: 'warning', content: msg });
							_this.indexstatus[currentIndex] = 'browse';
						}
					});

					let vbillcode = bill.head[AREA.form].rows[0].values.vbillcode.value;
					_this.setState({ vbillcode: vbillcode });
					_this.props.BillHeadInfo.setBillHeadInfoVisible({
						billCode: vbillcode,
						showBackBtn: true
					});
				} else {
					let bill = res.data.card;
					updateCacheData(
						_this.props,
						'pk_arriveorder',
						bill.head[AREA.form].rows[0].values.pk_arriveorder.value,
						bill,
						AREA.form,
						COMMON.arrivalCacheKey
					);
					let msg = getLangByResId(_this, '4004ARRIVAL-000020'); /* 国际化处理： 保存成功,提交失败,失败原因：*/
					msg += res.data.errorMsg;
					toast({ color: 'warning', content: msg });
					let vbillcode = bill.head[AREA.form].rows[0].values.vbillcode.value;
					_this.props.BillHeadInfo.setBillHeadInfoVisible({
						billCode: vbillcode,
						showBackBtn: true
					});
				}
			}
			if (
				res.data &&
				res.data.workflow &&
				(res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')
			) {
				_this.props.form.setFormItemsValue(AREA.form, {
					ts: { value: res.data.ts },
					pk_arriveorder: { value: res.data.pk }
				});

				_this.setState({
					compositedata: res.data,
					compositedisplay: true
				});
				return;
			}
			_this.props.beforeUpdatePage();
			if (res && res.data && res.data.card && res.data.card.body) {
				let fullTableData = _this.props.cardTable.updateDataByRowId(
					AREA.body,
					res.data.card.body[AREA.body],
					true
				);
				res.data.card.body = fullTableData;
			}
			if (res && res.data && res.data.card && res.data.card.head) {
				_this.props.form.setAllFormValue({ [AREA.head]: res.data.card.head[AREA.head] });
			}
			let arriveid = res.data.card.head[AREA.head].rows[0].values.pk_arriveorder.value;
			if (_this.props.getUrlParam('type')) {
				let bill = res.data.card;
				rewriteTransferSrcBids(_this.props, 'csourcebid', bill[AREA.body].rows);
				let cachepk = getCacheDataByPk(
					_this.props,
					COMMON.arrivalCacheKey,
					bill.head[AREA.form].rows[0].values.pk_arriveorder.value
				);
				if (cachepk) {
					updateCacheData(
						_this.props,
						'pk_arriveorder',
						bill.head[AREA.form].rows[0].values.pk_arriveorder.value,
						bill,
						AREA.form,
						COMMON.arrivalCacheKey
					);
				} else {
					// 转单编辑界面保存
					addCacheData(
						_this.props,
						'pk_arriveorder',
						bill.head[AREA.form].rows[0].values.pk_arriveorder.value,
						bill,
						AREA.form,
						COMMON.arrivalCacheKey
					);
				}
				// let bill = res.data.card;
				let vbillcode = bill.head[AREA.form].rows[0].values.vbillcode.value;
				_this.props.BillHeadInfo.setBillHeadInfoVisible({
					billCode: vbillcode,
					showBackBtn: true
				});
				_this.props.transferTable.setTransformFormStatus(AREA.leftarea, {
					status: true,
					onChange: (current, next, currentIndex) => {
						_this.props.transferTable.setTransferListValueByIndex(
							AREA.leftarea,
							res.data.card,
							currentIndex
						);
						showSuccessInfo(getLangByResId(_this, '4004ARRIVAL-000000')); /* 国际化处理： 保存成功*/
						showSuccessInfo(getLangByResId(_this, '4004ARRIVAL-000017')); /* 国际化处理： 提交成功*/
						_this.indexstatus[currentIndex] = 'browse';
					}
				});

				if (_this.props.transferTable.getTransformFormAmount(AREA.leftarea) == 1) {
					let vbillcode = bill.head[AREA.form].rows[0].values.vbillcode.value;
					_this.setState({ vbillcode: vbillcode });
				}
			} else {
				changeUrlParam(_this.props, { id: arriveid, status: 'browse' });
				updateCacheData(_this.props, 'pk_arriveorder', arriveid, res.data, AREA.head, COMMON.arrivalCacheKey);
				_this.props.cardTable.selectAllRows(AREA.body, false);
				// _this.setState({ isShowBack: true });
				showSuccessInfo(getLangByResId(_this, '4004ARRIVAL-000000')); /* 国际化处理： 保存成功*/
				showSuccessInfo(getLangByResId(_this, '4004ARRIVAL-000017')); /* 国际化处理： 提交成功*/
				let bill = res.data.card;
				let vbillcode = bill.head[AREA.form].rows[0].values.vbillcode.value;
				_this.props.BillHeadInfo.setBillHeadInfoVisible({
					billCode: vbillcode,
					showBackBtn: true
				});
				_this.props.updatePage(AREA.form, AREA.body);
				buttonController.call(_this);
			}
		}
	});
}
