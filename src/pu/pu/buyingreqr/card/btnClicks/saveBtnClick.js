/*
 * @Author: zhangchangqing 
 * @PageInfo: 保存按钮事件
 * @Date: 2018-04-19 10:35:13 
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2021-09-10 13:48:07
 */
import { BUYINGREQ_CARD, BUYINGREQ_LIST, ATTRCODES } from '../../siconst';
import { ajax } from 'nc-lightapp-front';
import { updatePKCache } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { checkDateUtil } from '../../../pub/utils/checkDateUtil';
import { showWarningDialog, showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { buttonController } from '../viewControl';
let tableId = BUYINGREQ_CARD.tableId; //body
let formId = BUYINGREQ_CARD.formId; //head
export default function clickSaveBtn(props, skipCodes) {
	//过滤表格空行
	props.cardTable.filterEmptyRows(tableId, [ ATTRCODES.pk_material ], 'include');
	if (!props.cardTable.getAllRows(tableId).length) {
		showWarningDialog(getLangByResId(this, '4004PRAYBILLR-000013')); /* 国际化处理： 表体为空*/
		return;
	}
	let flag = this.props.validatePageToToast([
		{
			// creteForm 使用的areaCode
			name: [ BUYINGREQ_CARD.formId ],
			type: 'form'
		},
		{
			// createCardTable的areaCode，多页签区域填主表就行
			name: BUYINGREQ_CARD.tableId,
			type: 'cardTable'
		}
	]);
	if (!flag.allPassed) {
		return;
	}
	let msg = checkDateUtil.call(this, props);
	if (msg && msg.length > 0) {
		showWarningDialog(null, msg + getLangByResId(this, '4004PRAYBILLR-000014'), {
			/* 国际化处理： 是否继续保存？*/
			beSureBtnClick: backtotransfer.bind(this, props, skipCodes)
		});
	} else {
		backtotransfer.call(this, props, skipCodes);
	}
}
function backtotransfer(props, skipCodes) {
	//自己的逻辑
	let data = props.createMasterChildDataSimple(BUYINGREQ_CARD.cardpageid, formId, tableId);
	data.body.card_body.rows.map((item, index) => {
		item.values.pseudocolumn.value = index + '';
		let sta = item.status;
		if (sta == 2) {
			item.values.pk_praybill.value = null;
			item.values.pk_praybill_b.value = null;
		}
	});
	// 获取老版本主键,删除缓存时使用
	let oldPk_praybill = data.head[BUYINGREQ_CARD.formId].rows[0].values.pk_praybill.value;
	let fbillstatus;
	data.pageid = BUYINGREQ_CARD.cardpageid;
	data.templetid = this.state.templetid;
	skipCodes = skipCodes ? skipCodes : new Array();
	data['skipCodes'] = skipCodes;
	let status = props.getUrlParam(BUYINGREQ_CARD.status);
	let url = '';
	if (status == BUYINGREQ_CARD.add) {
		url = BUYINGREQ_CARD.newSaveURL;
	} else if (status == BUYINGREQ_CARD.edit) {
		url = BUYINGREQ_CARD.saveURL;
	}
	this.props.cardTable.selectAllRows(BUYINGREQ_CARD.tableId, false);
	this.props.validateToSave(data, () => {
		ajax({
			url: url,
			data: data,
			success: (res) => {
				this.props.beforeUpdatePage();
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(res.formulamsg);
				}
				let pk_praybill = null;

				if (res.data.isResume && res.data.isResume == true) {
					showResumeModal.bind(this)(props, 'ResumeMessageDlg', skipCodes, res.data, clickSaveBtn, props);
					return;
				} else {
					if (res.success) {
						if (res.data) {
							if (res.data.head && res.data.head[formId]) {
								props.form.setAllFormValue({ [formId]: res.data.head[formId] });
								pk_praybill = res.data.head[formId].rows[0].values.pk_praybill.value;
								let billId = pk_praybill;
								let pk_srcpraybill = res.data.head[formId].rows[0].values.pk_srcpraybill.value;
								// 上传附件时,不论版本,单据状态如何变化,保证附件关联的是原始主键
								if (pk_srcpraybill) {
									billId = pk_srcpraybill;
								}
								fbillstatus = res.data.head[BUYINGREQ_CARD.formId].rows[0].values.fbillstatus.value;
								props.pushTo(BUYINGREQ_CARD.cardUrl, {
									status: BUYINGREQ_CARD.browse,
									id: pk_praybill
								});
								this.setState({
									billId: billId
								});
								// updateCacheData(
								// 	props,
								// 	'pk_praybill',
								// 	pk_praybill,
								// 	res.data,
								// 	BUYINGREQ_CARD.formId,
								// 	BUYINGREQ_LIST.dataSource
								// );
								// 替换主键，并替换主键对应的单据数据
								updatePKCache(
									BUYINGREQ_LIST.dataSource,
									pk_praybill,
									oldPk_praybill,
									BUYINGREQ_CARD.formId,
									res.data
								);
							}

							if (res.data.body && res.data.body[tableId]) {
								let fullTableData = props.cardTable.updateDataByRowId(
									tableId,
									res.data.body[tableId],
									true
								);
								res.data.body[tableId] = fullTableData;
							}
							//设置按钮显示
							buttonController.setButtonByStatus.call(this, this.props, fbillstatus);
							buttonController.setCardPaginationVisible(this.props, true); //设置翻页显示
							this.toggleShow();
						}
						showSuccessInfo(getLangByResId(this, '4004PRAYBILLR-000028')); /* 国际化处理： 修订成功！*/
					}
				}
				this.props.updatePage(BUYINGREQ_CARD.formId, BUYINGREQ_CARD.tableId);
			}
		});
	});
}
