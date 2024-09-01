/*
 * @Author: tianzhyw 
 * @PageInfo: 卡片页面提交按钮
 * @Date: 2021-06-03 10:40:53 
 * @Last Modified by: tianzhyw 
 * @Last Modified time: 2021-06-03 10:40:53 
 */
import { BUYINGREQ_CARD, BUYINGREQ_LIST, ATTRCODE, FBILLSTATUS } from '../../siconst';
import { ajax } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { buttonController } from '../viewControl';
import {
	addCacheData,
	deleteCacheData,
	updateCacheData
} from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import {
	updateDtaForCompareByPk,
	updateExtBillDataForCompareByPk
} from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/compareUtils';
import { updatePKCache } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';
import { pageInfoClick } from '../btnClicks';
export default function commitBtnClick(props, assign, skipCodes) {
	let pk = this.props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_praybill).value;
	let ts = this.props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.ts).value;
	let rows = this.props.cardTable.getAllRows(BUYINGREQ_CARD.tableId);
	let bodys = [];
	rows.forEach((row) => {
		bodys.push({
			id: row.values[BUYINGREQ_CARD.config.bodyPKfield].value,
			ts: row.values[ATTRCODE.ts].value
		});
	});
	// 执行打开或者关闭操作
	let delRows = [];
	let dataS = {
		id: pk,
		ts: ts,
		bodys: bodys
	};
	delRows.push(dataS);
	// 拼装json
	let data = {
		deleteInfos: delRows,
		pageid: BUYINGREQ_CARD.cardpageid,
		iscard: 'card'
	};
	if (assign) {
		data['assign'] = JSON.stringify(assign);
	}
	if (skipCodes instanceof Array) {
		data['skipCodes'] = skipCodes;
	} else {
		skipCodes = skipCodes ? [ skipCodes ] : new Array();
		data['skipCodes'] = skipCodes;
	}
	// 发送请求
	ajax({
		url: BUYINGREQ_CARD.commitURL,
		data: data,
		success: (res) => {
			if (res.success) {
				if (res.data.isResume && res.data.isResume == true) {
					showResumeModal.bind(this)(
						props,
						'ResumeMessageDlg',
						skipCodes,
						res.data,
						commitBtnClick,
						props,
						assign
					);
					return false;
				}
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(res.formulamsg);
				}
				if (data === undefined) {
					//订单编号
					this.setState({
						vbillcode: '',
						billId: ''
					});
					return;
				}
				//渲染数据前先清空值，
				let pkid;
				let fbillstatus;
				if (res.data.data.head && res.data.data.body) {
					fbillstatus = res.data.data.head[BUYINGREQ_CARD.formId].rows[0].values.fbillstatus.value;
					// 审批通过时才进行替换主键
					if (fbillstatus == FBILLSTATUS.approved) {
						updateDtaForCompareByPk(this.props, res.data.data, BUYINGREQ_CARD.configSrc);
						// 设置表头数据
						// props.form.setAllFormValue({
						// 	[BUYINGREQ_CARD.formId]: res.data.data.head[BUYINGREQ_CARD.formId]
						// });
						// // 补全表头数据
						// res.data.data.head[BUYINGREQ_CARD.formId].rows = props.form.getAllFormValue(
						// 	BUYINGREQ_CARD.formId
						// ).rows;
						// let fullTableData = props.cardTable.updateDataByIndexs(
						// 	BUYINGREQ_CARD.tableId,
						// 	res.data.data.body[BUYINGREQ_CARD.tableId],
						// 	true
						// );
						// res.data.data.body[BUYINGREQ_CARD.tableId] = fullTableData;
						// // 设置表体数据
						// props.cardTable.setTableData(
						// 	BUYINGREQ_CARD.tableId,
						// 	res.data.data.body[BUYINGREQ_CARD.tableId],
						// 	null,
						// 	true,
						// 	true
						// );
					} else {
						updateDtaForCompareByPk(this.props, res.data.data, BUYINGREQ_CARD.config);
					}
					// let map = new Map();
					// map.set('pk_praybill_b', BUYINGREQ_CARD.tableId);
					// let config = {
					// 	headAreaId: BUYINGREQ_CARD.formId,
					// 	bodyIdAndPkMap: map
					// };
					// updateExtBillDataForCompareByPk(this.props, res.data.data, config);

					pkid = res.data.data.head[BUYINGREQ_CARD.formId].rows[0].values.pk_praybill.value;
					let billId = pkid;
					let pk_srcpraybill = res.data.data.head[BUYINGREQ_CARD.formId].rows[0].values.pk_srcpraybill.value;
					// 上传附件时,不论版本,单据状态如何变化,保证附件关联的是原始主键
					if (pk_srcpraybill) {
						billId = pk_srcpraybill;
					}
					this.setState({
						lineShowType: [],
						vbillcode: res.data.data.head[BUYINGREQ_CARD.formId].rows[0].values.vbillcode.value,
						billId: billId,
						billtype: res.data.data.head[BUYINGREQ_CARD.formId].rows[0].values.vtrantypecode.value
					});
				}
				// 审批通过时才进行替换主键，并替换主键对应的单据数据,并且更新缓存
				if (fbillstatus == FBILLSTATUS.approved) {
					deleteCacheData(this.props, ATTRCODE.pk_praybill, pk, BUYINGREQ_LIST.dataSource);
					addCacheData(
						this.props,
						ATTRCODE.pk_praybill,
						pkid,
						res.data.data,
						BUYINGREQ_CARD.formId,
						BUYINGREQ_LIST.dataSource
					);
					props.cardTable.setTableData(
						BUYINGREQ_CARD.tableId,
						res.data.data.body[BUYINGREQ_CARD.tableId],
						null,
						true,
						true
					);
					this.props.setUrlParam({ id: pkid });
					// updatePKCache(BUYINGREQ_LIST.dataSource, pkid, pk, BUYINGREQ_CARD.formId, res.data.data);
					pageInfoClick.call(this, this.props);
				} else {
					updateCacheData(
						this.props,
						ATTRCODE.pk_praybill,
						pkid,
						res.data.data,
						BUYINGREQ_CARD.formId,
						BUYINGREQ_LIST.dataSource
					);
				}
				//设置按钮显示
				buttonController.setButtonByStatus.call(this, this.props, fbillstatus);
				this.toggleShow();
				showSuccessInfo(getLangByResId(this, '4004PRAYBILLR-000031')); /* 国际化处理： 提交成功！*/
				buttonController.lineSelected.call(this);
			}
		}
	});
}
