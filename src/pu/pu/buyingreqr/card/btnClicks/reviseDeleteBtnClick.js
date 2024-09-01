/*
 * @Author: tianzhyw 
 * @PageInfo: 卡片修订删除按钮
 * @Date: 2021-06-04 15:11:05 
 * @Last Modified by: tianzhyw 
 * @Last Modified time: 2021-06-04 15:11:05 
 */
import { ajax } from 'nc-lightapp-front';
import { ATTRCODE, BUYINGREQ_CARD, BUYINGREQ_LIST } from '../../siconst';
import { updatePKCache, deleteCacheData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { buttonController } from '../viewControl';
import { showSuccessInfo, showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { updateDtaForCompareByPk } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/compareUtils';
import { pageInfoClick } from '../btnClicks';
export default function reviseDeleteBtnClick(props) {
	showWarningDialog(getLangByResId(this, '4004PRAYBILLR-000032'), getLangByResId(this, '4004PRAYBILLR-000033'), {
		/* 国际化处理： 是否确定要删除该修订？*/
		beSureBtnClick: backtotransfer.bind(this, props)
	});
}
function backtotransfer() {
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
	// 组装数据
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
	ajax({
		url: BUYINGREQ_CARD.reviseDeleteURL,
		data: data,
		success: (res) => {
			if (res.success) {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg, //参数一：返回的公式对象
						{
							//参数二：界面使用的表格类型
							card_body: 'cardTable'
						}
					);
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
					//差异更新
					// updateDtaForCompareByPk(this.props, res.data.data, BUYINGREQ_CARD.config);
					// let pks;
					pkid = res.data.data.head[BUYINGREQ_CARD.formId].rows[0].values.pk_praybill.value;
					// let pk_srcpraybill = res.data.data.head[BUYINGREQ_CARD.formId].rows[0].values.pk_srcpraybill;
					// // 上传附件时,不论版本,单据状态如何变化,保证附件关联的是原始主键
					// if (pk_srcpraybill) {
					// 	pks = pk_srcpraybill.value;
					// } else {
					// 	pks = pkid;
					// }
					// this.setState({
					// 	lineShowType: [],
					// 	vbillcode: res.data.data.head[BUYINGREQ_CARD.formId].rows[0].values.vbillcode.value,
					// 	billId: pks,
					// 	billtype: res.data.data.head[BUYINGREQ_CARD.formId].rows[0].values.vtrantypecode.value
					// });
					fbillstatus = res.data.data.head[BUYINGREQ_CARD.formId].rows[0].values.fbillstatus.value;
				}
				//设置按钮显示
				buttonController.setButtonByStatus.call(this, this.props, fbillstatus);
				// this.toggleShow();
				// 替换主键，并替换主键对应的单据数据
				// updatePKCache(BUYINGREQ_LIST.dataSource, pkid, pk, BUYINGREQ_CARD.formId, res.data.data);
				deleteCacheData(this.props, ATTRCODE.pk_praybill, pk, BUYINGREQ_LIST.dataSource);
				pageInfoClick.call(this, this.props, pkid);
				showSuccessInfo(getLangByResId(this, '4004PRAYBILLR-000035')); /* 国际化处理： 修订删除成功！*/
				buttonController.lineSelected.call(this);
			}
		}
	});
}
