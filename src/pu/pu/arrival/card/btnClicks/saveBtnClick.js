/*
 * @Author: zhangshqb 
 * @PageInfo: 保存
 * @Date: 2018-04-28 10:17:14 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-07-27 09:57:26
 */
import { ajax } from 'nc-lightapp-front';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';
import { showSuccessInfo, showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { URL, COMMON, AREA, PAGECODE, FIELD } from '../../constance';
import { addCacheData, rewriteTransferSrcBids } from '../../../../../scmpub/scmpub/pub/cache';
import { changeUrlParam, updateCacheData, getCacheDataByPk } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { saveBtnClick } from '.';
import buttonController from '../viewControl/buttonController';
import cancelPastBtnClick from './cancelPastBtnClick';
export default function buttonClick(props, id, skipCodes) {
	let _this = this;

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
	cancelPastBtnClick.call(this);
	let data = _this.props.createMasterChildDataSimple(PAGECODE.card, AREA.form, AREA.body);
	let pk_arriveorder = props.form.getFormItemsValue(AREA.head, 'pk_arriveorder');
	let isAdd = false;
	if (pk_arriveorder && pk_arriveorder.value != null) {
		isAdd = true;
	} else {
		isAdd = false;
		let rows = [];
		data.body.body.rows.map((item) => {
			let sta = item.status;
			if (sta != 3) {
				rows.push(item);
			}
		});
		data.body.body.rows = rows;
	}
	skipCodes = skipCodes ? skipCodes : new Array();
	if (skipCodes) {
		data['skipCodes'] = skipCodes;
	}
	let rows = data.body.body.rows;
	rows.forEach((row, index) => {
		row.values.pseudocolumn.value = index + '';
	});

	_this.props.validateToSave(data, () => {
		ajax({
			method: 'post',
			url: URL.save,
			data: data,
			success: (res) => {
				_this.props.beforeUpdatePage();
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					_this.props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
						// {
						// 	//参数二：界面使用的表格类型
						// 	[PAGECODE.head_payment]: 'cardTable',
						// 	[PAGECODE.cardbody]: 'cardTable'
						// }
					);
				}

				if (res.data.isResume && res.data.isResume == true) {
					showResumeModal.call(
						_this,
						_this.props,
						'MessageDlg',
						// [ 'Y' ],
						skipCodes,
						res.data,
						saveBtnClick.bind(_this),
						_this.props,
						id
					);
					return;
				}
				if (res && res.data && res.data.body) {
					let fulltabeData = _this.props.cardTable.updateDataByRowId(
						AREA.body,
						res.data.body[AREA.body],
						true
					);
					res.data.body[AREA.body] = fulltabeData;
				}
				if (res && res.data && res.data.head) {
					_this.props.form.setAllFormValue({ [AREA.head]: res.data.head[AREA.head] });
				}
				let status = _this.props.getUrlParam('status');
				let type = _this.props.getUrlParam('type');
				let arriveid = res.data.head[AREA.head].rows[0].values.pk_arriveorder.value;
				let bill = res.data;
				changeUrlParam(_this.props, { id: arriveid, status: 'browse' });
				// let cachepk = getCacheDataByPk(
				// 	_this.props,
				// 	COMMON.arrivalCacheKey,
				// 	bill.head[AREA.form].rows[0].values.pk_arriveorder.value
				// );
				if (isAdd) {
					updateCacheData(
						_this.props,
						'pk_arriveorder',
						arriveid,
						res.data,
						AREA.head,
						COMMON.arrivalCacheKey
					);
				} else {
					addCacheData(_this.props, 'pk_arriveorder', arriveid, res.data, AREA.head, COMMON.arrivalCacheKey);
				}

				_this.props.cardTable.selectAllRows(AREA.body, false);
				let vbillcode = res.data.head[AREA.form].rows[0].values.vbillcode.value;
				if (this.isapprove == 'Y') {
					_this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
					_this.setState({ vbillcode: vbillcode });
					_this.props.BillHeadInfo.setBillHeadInfoVisible({
						billCode: vbillcode,
						showBackBtn: false
					});
				} else {
					_this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
					_this.setState({ vbillcode: vbillcode });
					_this.props.BillHeadInfo.setBillHeadInfoVisible({
						billCode: vbillcode,
						showBackBtn: true
					});
				}
				if (type) {
					let bill = res.data;
					rewriteTransferSrcBids(_this.props, 'csourcebid', bill.body[AREA.body].rows);
					_this.props.transferTable.setTransformFormStatus(AREA.leftarea, {
						status: true,
						onChange: (current, next, currentIndex) => {
							showSuccessInfo(getLangByResId(_this, '4004ARRIVAL-000000')); /* 国际化处理： 保存成功*/
							_this.props.transferTable.setTransferListValueByIndex(
								AREA.leftarea,
								res.data,
								currentIndex
							);
							_this.indexstatus[currentIndex] = 'browse';
						}
					});
				} else {
					showSuccessInfo(getLangByResId(_this, '4004ARRIVAL-000000')); /* 国际化处理： 保存成功*/
					buttonController.call(_this);
				}

				_this.props.updatePage(AREA.form, AREA.body);
			}
		});
	});
}
