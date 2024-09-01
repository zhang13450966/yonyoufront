/*
 * @Author: CongKe
 * @PageInfo: 保存提交
 * @Date: 2018-04-28 10:17:14
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-03-03 16:41:03
 */
import { ajax } from 'nc-lightapp-front';
import { showResumeModal, showWarningInfo } from 'scmpub/scmpub/components/ResumeModal';
import { showSaveAndCommitInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { URL, COMMON, AREA, PAGECODE, FIELD } from '../../constance';
import { addCacheData, rewriteTransferSrcBids } from '../../../../../scmpub/scmpub/pub/cache';
import { changeUrlParam, updateCacheData, getCacheDataByPk } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import buttonController from '../viewControl/buttonController';
import cancelPastBtnClick from './cancelPastBtnClick';

export default function saveAndCommit(assign, skipCodes) {
	let _this = this;
	let props = _this.props;
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
	let data = props.createMasterChildDataSimple(PAGECODE.card, AREA.form, AREA.body);
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
	if (assign) {
		data['assign'] = JSON.stringify(assign);
	}
	props.validateToSave(data, () => {
		ajax({
			method: 'post',
			url: URL.saveandcommit,
			data: data,
			success: (res) => {
				if (
					res.data &&
					res.data.workflow &&
					(res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')
				) {
					_this.skipCodes = data['skipCodes'];
					_this.setState({
						compositedata: res.data,
						compositedisplay: true,
						saveAndCommit: true
					});
					return;
				}
				props.beforeUpdatePage();
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}

				if (res.data.isResume && res.data.isResume == true) {
					showResumeModal.call(
						_this,
						props,
						'MessageDlg',
						// [ 'Y' ],
						skipCodes,
						res.data,
						saveAndCommit.bind(_this),
						assign
					);
					return;
				}
				props.cardTable.selectAllRows(AREA.body, false);
				let billcard = res && res.data && res.data.card;
				if (billcard && billcard.body) {
					// 先表体
					let fulltabeData = props.cardTable.updateDataByRowId(AREA.body, billcard.body[AREA.body], true);
					billcard.body = fulltabeData;
				}
				if (billcard && billcard.head) {
					// 表体处理完成后表头处理
					props.form.setAllFormValue({ [AREA.head]: billcard.head[AREA.head] });
					let arriveid = pk_arriveorder.value;
					changeUrlParam(props, { id: arriveid, status: 'browse' });
					if (isAdd) {
						updateCacheData(props, 'pk_arriveorder', arriveid, billcard, AREA.head, COMMON.arrivalCacheKey);
					} else {
						arriveid = billcard.head[AREA.head].rows[0].values.pk_arriveorder.value;
						addCacheData(props, 'pk_arriveorder', arriveid, billcard, AREA.head, COMMON.arrivalCacheKey);
					}
					let vbillcode = billcard.head[AREA.form].rows[0].values.vbillcode.value;
					if (this.isapprove == 'Y') {
						props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
						_this.setState({ vbillcode: vbillcode });
						props.BillHeadInfo.setBillHeadInfoVisible({
							billCode: vbillcode,
							showBackBtn: false
						});
					} else {
						props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
						_this.setState({ vbillcode: vbillcode });
						props.BillHeadInfo.setBillHeadInfoVisible({
							billCode: vbillcode,
							showBackBtn: true
						});
					}
				}

				let type = props.getUrlParam('type');
				if (type) {
					rewriteTransferSrcBids(props, 'csourcebid', billcard[AREA.body].rows);
					props.transferTable.setTransformFormStatus(AREA.leftarea, {
						status: true,
						onChange: (current, next, currentIndex) => {
							_this.indexstatus[currentIndex] = 'browse';
						}
					});
					if (props.transferTable.getTransformFormAmount(AREA.leftarea) == 1) {
						let vbillcode = billcard.head[AREA.form].rows[0].values.vbillcode.value;
						_this.setState({ vbillcode: vbillcode });
					}
				} else {
					buttonController.call(_this);
				}
				this.skipCodes = [];
				showSaveAndCommitInfo();
				props.updatePage(AREA.form, AREA.body);
			}
		});
	});
}
