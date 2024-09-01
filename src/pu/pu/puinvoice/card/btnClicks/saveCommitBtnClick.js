/*
 * @Author: jiangfw 
 * @PageInfo: 保存提交
 * @Date: 2018-06-13 21:16:59 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-04-12 14:11:18
 */
import { ajax } from 'nc-lightapp-front';
import { URL, UISTATE, AREA, MODAL_ID, FIELD, COMMON, PK } from '../../constance';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {
	changeUrlParam,
	updateCacheData,
	addCacheData,
	rewriteTransferSrcBids,
	getDefData,
	setDefData
} from '../../../../../scmpub/scmpub/pub/cache';
import { showErrorInfo, showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import btnController from '../viewControl/btnController';
export default function clickSaveBtn(skipCodes, assign) {
	let props = this.props;
	//表单必输校验
	//过滤表格空行
	props.cardTable.filterEmptyRows(this.tableId, [ FIELD.pk_material ], 'include');
	if (!props.cardTable.getAllRows(this.tableId).length) {
		showErrorInfo(null, getLangByResId(this, '4004PUINVOICE-000020') /* 国际化处理： 表体为空*/);
		return;
	}
	let flag = props.validatePageToToast([
		{
			// creteForm 使用的areaCode
			name: [ this.formId ],
			type: 'form'
		},
		{
			// createCardTable的areaCode，多页签区域填主表就行
			name: this.tableId,
			type: 'cardTable'
		}
	]);
	if (!flag.allPassed) {
		return;
	}
	let data = props.createMasterChildDataSimple(this.pageId, this.formId, this.tableId);
	data['skipCodes'] = skipCodes ? skipCodes : (skipCodes = new Array());
	data.templetid = this.templetid_25;
	if (assign) {
		data['assign'] = JSON.stringify(assign);
	}
	// 设置pseudocolumn字段值，用于前后台合并
	let rows = data.body.card_body.rows;
	rows.forEach((row, index) => {
		row.values.pseudocolumn.value = index + '';
	});

	//暂存保存
	let tempsave = getDefData(COMMON.tempCardCacheKey, 'tempsave');

	//暂存保存，将表头设置为新增
	if (tempsave) {
		data.head.card_head.rows[0].status = '2';
	}

	//保存
	props.validateToSave(data, () => {
		ajax({
			url: URL.saveCommit,
			pageid: this.pageId,
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
				// 执行公式
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				if (res.success && res.data) {
					// 交互式异常处理
					if (res.data.isResume && res.data.isResume == true) {
						showResumeModal.call(
							this,
							props,
							MODAL_ID.MessageDlg,
							skipCodes,
							res.data,
							clickSaveBtn.bind(this, skipCodes, assign),
							props
						);
						return;
					}

					let bfee = res.data.head[this.formId].rows[0].values.bfee.value;
					let vbillcode = res.data.head[this.formId].rows[0].values.vbillcode.value;
					let pk_invoice = res.data.head[this.formId].rows[0].values.pk_invoice.value;
					this.pk_invoice = pk_invoice;
					let type = props.getUrlParam('type');
					let pk = props.getUrlParam('id');
					let copy = props.getUrlParam('copy');
					let channelType = props.getUrlParam('channelType');

					props.beforeUpdatePage();
					if (res.data.head && res.data.body) {
						props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
						let fullTableData = props.cardTable.updateDataByRowId(
							this.tableId,
							res.data.body[this.tableId],
							true
						);
						res.data.body[this.tableId] = fullTableData;
					}

					if (pk && !copy && !bfee) {
						// 修改保存
						updateCacheData(
							props,
							FIELD.pk_invoice,
							pk_invoice,
							res.data,
							this.formId,
							COMMON.PuinvoiceCacheKey
						);
					} else {
						// 新增保存
						addCacheData(
							props,
							FIELD.pk_invoice,
							pk_invoice,
							res.data,
							this.formId,
							COMMON.PuinvoiceCacheKey
						);
						// 更新翻页组件当前pk值
						props.cardPagination.setCardPaginationId({
							id: pk_invoice,
							status: 1
						});
					}
					props.updatePage(AREA.card_head, AREA.card_body);
					showSuccessInfo(getLangByResId(this, '4004PUINVOICE-000083' /* 国际化处理： 保存成功*/));

					//转单
					if (type || channelType) {
						if (type == 'transfer21Pto25') {
							rewriteTransferSrcBids(props, PK.body25pk, res.data.body[this.tableId].rows);
						} else {
							rewriteTransferSrcBids(props, FIELD.csourcebid, res.data.body[this.tableId].rows);
						}
						//多单编辑情况注意保存提交时 切换下一条在提交中做
						props.transferTable.setTransformFormStatus(AREA.card_left, {
							status: true,
							onChange: (current, next, currentIndex) => {
								props.transferTable.setTransferListValueByIndex(AREA.card_left, res.data, currentIndex);
								let cacheDataBody = props.transferTable.updateTransferListValueByIndex(
									AREA.card_left,
									res.data,
									currentIndex
								);
								this.indexstatus[currentIndex] = UISTATE.browse;
							}
						});
					} else {
						props.beforeUpdatePage();
						this.setBillHeadInfo(vbillcode);
						changeUrlParam(props, { id: pk_invoice, status: UISTATE.browse });
						btnController.call(this);
						props.updatePage(AREA.card_head, AREA.card_body);
					}

					// 取消勾选
					props.cardTable.selectAllRows(AREA.card_body, false);
					this.skipCodes = [];
				}
			}
		});
	});

	setDefData(COMMON.tempCardCacheKey, 'tempsave', false);
}
