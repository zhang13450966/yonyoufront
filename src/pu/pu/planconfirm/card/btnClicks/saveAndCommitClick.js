/*
 * @Author: CongKe
 * @PageInfo: 保存提交
 * @Date: 2018-04-28 10:17:14
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-03-11 16:49:56
 */
import { ajax } from 'nc-lightapp-front';
import { showResumeModal, showWarningInfo } from 'scmpub/scmpub/components/ResumeModal';
import { showSaveAndCommitInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { URL, AREA, PAGECODE, FIELD, CONSTFIELD, UISTATE } from '../../constance';
import { addCacheData, rewriteTransferSrcBids } from '../../../../../scmpub/scmpub/pub/cache';
import { changeUrlParam, updateCacheData, getCacheDataByPk } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewController';

export default function saveAndCommitClick(props, assign) {
	props.cardTable.filterEmptyRows(AREA.body, [ FIELD.pk_material ], 'include');
	if (!props.cardTable.getAllRows(AREA.body).length) {
		showWarningInfo(null, getLangByResId(this, '4004planconfirm-000041')); /* 国际化处理： 表体为空*/
		return;
	}
	let flag = this.props.validatePageToToast([
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

	let data = props.createMasterChildDataSimple(PAGECODE.card, AREA.head, AREA.body);
	let pk_planconfirm = props.form.getFormItemsValue(AREA.head, FIELD.hid);
	let isAdd = false;
	if (pk_planconfirm && pk_planconfirm.value != null) {
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

	let rows = data.body.body.rows;
	rows.forEach((row, index) => {
		row.values.pseudocolumn.value = index + '';
	});
	//去掉删除行且主键为空的
	let bodyrows = data.body[AREA.body].rows;
	let needrows = [];
	bodyrows.forEach((item) => {
		if (!(item.status == '3' && !(item.values[FIELD.bid] || {}).value)) {
			needrows.push(item);
		}
	});
	data.body[AREA.body].rows = needrows;

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
					this.skipCodes = data['skipCodes'];
					this.setState({
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
					let planconfirmid = pk_planconfirm.value;
					changeUrlParam(props, { id: planconfirmid, status: 'browse' });
					if (isAdd) {
						updateCacheData(
							props,
							'pk_planconfirm',
							planconfirmid,
							billcard,
							AREA.head,
							CONSTFIELD.planConfirmCacheKey
						);
					} else {
						planconfirmid = billcard.head[AREA.head].rows[0].values.pk_planconfirm.value;
						addCacheData(
							props,
							'pk_planconfirm',
							planconfirmid,
							billcard,
							AREA.head,
							CONSTFIELD.planConfirmCacheKey
						);
					}
					let vbillcode = billcard.head[AREA.head].rows[0].values.vbillcode.value;
					props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
					this.setState({ vbillcode: vbillcode });
					props.BillHeadInfo.setBillHeadInfoVisible({
						billCode: vbillcode,
						showBackBtn: true
					});
				}
				this.status = UISTATE.browse; // 保存完成之后，页面设置为浏览态
				buttonController.call(this, props);

				this.skipCodes = [];
				showSaveAndCommitInfo();
				props.updatePage(AREA.head, AREA.body);
				let channelType = props.getUrlParam('channelType');
				//转单
				if (channelType) {
					res.data = res.data.card;
					rewriteTransferSrcBids(props, FIELD.csourcebid, res.data.body.rows);

					props.transferTable.setTransformFormStatus(AREA.leftarea, {
						status: true,
						onChange: (current, next, currentIndex) => {
							props.transferTable.setTransferListValueByIndex(AREA.leftarea, res.data, currentIndex);
							let cacheDataBody = props.transferTable.updateTransferListValueByIndex(
								AREA.leftarea,
								res.data,
								currentIndex
							);
							this.indexstatus[currentIndex] = UISTATE.browse;
						}
					});
				}
			}
		});
	});
}
